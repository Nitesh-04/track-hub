import { NextResponse } from "next/server";
import prisma from "@/utils/db";
import {GoogleGenAI} from '@google/genai';
import { applicationPrompt, roundPrompt } from "./util/prompt";
import { ApplicationData, RoundEmail } from "@/lib/types";
import * as XLSX from "xlsx";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MAX_INLINE_ATTACHMENT_BYTES = 4 * 1024 * 1024;

type GeminiPart =
  | { text: string }
  | { inlineData: { data: string; mimeType: string } };

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});


export async function POST(req: Request) {
  const { clerkid, historyId } = await req.json();

  if (!clerkid || !historyId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Load user credentials
  const cred = await prisma.emailCredential.findFirst({
    where: { clerkid },
  });

  if (!cred) {
    return NextResponse.json(
      { error: "No credentials for user" },
      { status: 400 }
    );
  }

  const userProfile = await prisma.user.findUnique({
    where: { clerkid },
    select: { name: true },
  });

  const userFullName = userProfile?.name?.trim();

  // Refresh access token if expired

  let accessToken = cred.accessToken;

  if (cred.expiresAt && cred.expiresAt < new Date()) {
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: cred.refreshToken,
      }),
    });

    const refreshJson = await refreshRes.json();

    if (refreshJson.access_token) {
      accessToken = refreshJson.access_token;

      await prisma.emailCredential.update({
        where: { id: cred.id },
        data: {
          accessToken,
          expiresAt: new Date(Date.now() + refreshJson.expires_in * 1000),
        },
      });
    }
  }


  // Fetch history changes
  const historyRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/history?startHistoryId=${cred.historyId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );


  const historyJson = await historyRes.json();

  if (!historyJson.history) {
    console.log("No new history");
    return NextResponse.json({ ok: true });
  }


  const messageIds = new Array<string>();

  // Collect message IDs from history

  for (const record of historyJson.history) {
    if (record.messagesAdded) {
      for (const m of record.messagesAdded) {
        messageIds.push(m.message.id);
      }
    }
  }



  // Fetch and process each message

  for (const id of messageIds) 
  {
      const msgRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const msgJson = await msgRes.json();

      const fromHeader =
        msgJson.payload.headers.find((h: any) => h.name === "From")?.value || "";

      if (!shouldProcess(fromHeader)) continue;

      const subject =
        msgJson.payload.headers.find((h: any) => h.name === "Subject")?.value ||
        "";
      const body = extractBody(msgJson.payload);


      const classification = classifyEmail(subject);

      // application processing

      if(classification === "application") {
        try {
          const prompt = applicationPrompt;

          const applicationParts = await buildGeminiPartsWithDocuments({
            messageId: id,
            payload: msgJson.payload,
            accessToken,
            baseText: `${body}\n\n${prompt}`,
          });

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: applicationParts,
              },
            ],
          });

          const rawResponse = response as any;

          const responseText =
            (typeof rawResponse?.response?.text === "function"
              ? rawResponse.response.text()
              : typeof rawResponse?.text === "function"
              ? rawResponse.text()
              : Array.isArray(rawResponse?.candidates)
              ? rawResponse.candidates
                  .flatMap((candidate: any) => candidate?.content?.parts ?? [])
                  .map((part: any) => part?.text ?? "")
                  .join("")
              : "{}") || "{}";

          const cleanedResponseText = responseText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          if (!cleanedResponseText) {
            console.warn("Gemini returned empty payload");
            continue;
          }

          let applicationResponse: Partial<ApplicationData>;

          try {
            applicationResponse = JSON.parse(cleanedResponseText) as Partial<ApplicationData>;
          } catch (parseErr) {
            console.error("Gemini JSON parse failed", parseErr, cleanedResponseText);
            continue;
          }

          await prisma.application.create({
            data: {
              companyName: applicationResponse.companyName ?? "Unknown Company",
              stipend: applicationResponse.stipend ?? null,
              role: applicationResponse.role ?? "Unknown Role",
              ctc: applicationResponse.ctc ?? null,
              location: applicationResponse.location ?? "Unknown",
              link: applicationResponse.link ?? null,
              notifications:
                applicationResponse.notifications ?? true,
              userId: cred.clerkid,
            },
          });

          console.log("Parsed Application:", applicationResponse);
        } catch (err) {
          console.error("AI parsing failed", err);
        }

      }

      // round processing 

      else if(classification === "round") {
          try {
          const prompt = roundPrompt;

          const contents = [
            { text : body + prompt},
          ];

          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
          });

          const rawResponse = response as any;

          const responseText =
            (typeof rawResponse?.response?.text === "function"
              ? rawResponse.response.text()
              : typeof rawResponse?.text === "function"
              ? rawResponse.text()
              : Array.isArray(rawResponse?.candidates)
              ? rawResponse.candidates
                  .flatMap((candidate: any) => candidate?.content?.parts ?? [])
                  .map((part: any) => part?.text ?? "")
                  .join("")
              : "{}") || "{}";

          const cleanedResponseText = responseText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          if (!cleanedResponseText) {
            console.warn("Gemini returned empty payload");
            continue;
          }

          let roundResponse: Partial<RoundEmail>;

          try {
            roundResponse = JSON.parse(cleanedResponseText) as Partial<RoundEmail>;
          } catch (parseErr) {
            console.error("Gemini JSON parse failed", parseErr, cleanedResponseText);
            continue;
          }

          if (!userFullName) {
            console.warn("User name missing. Cannot validate Excel contents for", cred.clerkid);
            continue;
          }

          console.log("Processing attachments")

          const userNamePresent = await excelAttachmentContainsUserName(
            id,
            msgJson.payload,
            accessToken,
            userFullName
          );

          if (!userNamePresent) {
            console.warn("User name not present in Excel attachments. Skipping round creation.");
            continue;
          }

          console.log("User name found in Excel attachment. Proceeding with round creation.");

          const existingApplication = await prisma.application.findFirst({
            where: {
              companyName: roundResponse.companyName,
              userId: cred.clerkid,
            },
            select: { id: true },
          });

          if (!existingApplication) {
            console.warn(
              "No application found for round email",
              roundResponse.companyName
            );
            continue;
          }

          const parsedRoundDate = roundResponse.roundDateTime
            ? new Date(roundResponse.roundDateTime)
            : null;

          if (!parsedRoundDate || isNaN(parsedRoundDate.getTime())) {
            console.warn("Invalid round date", roundResponse.roundDateTime);
            continue;
          }

          await prisma.round.create({
            data: {
              roundTitle: roundResponse.roundTitle ?? "Next Round",
              roundDateTime: parsedRoundDate,
              venue: roundResponse.venue ?? "Not specified",
              roundLink: roundResponse.roundLink ?? null,
              status: roundResponse.status ?? "upcoming",
              applicationId: existingApplication.id,
              userId: cred.clerkid,
            },
          });

          console.log("Parsed Application:", roundResponse);
        } catch (err) {
          console.error("AI parsing failed", err);
        }
      }

      // ignore 
      else {
        continue;
      }

  }

  await prisma.emailCredential.update({
    where: { id: cred.id },
    data: { historyId: historyId.toString() },
  });

  return NextResponse.json({ success: true });
}






// helper functions

function extractBody(payload: any): string {
  function walk(part: any): string {
    if (!part) return "";

    if (part.mimeType === "text/plain" && part.body?.data) {
      return Buffer.from(part.body.data, "base64").toString("utf8");
    }

    if (part.mimeType === "text/html" && part.body?.data) {
      return Buffer.from(part.body.data, "base64").toString("utf8");
    }

    if (part.parts) {
      for (const p of part.parts) {
        const result = walk(p);
        if (result) return result;
      }
    }

    return "";
  }

  return walk(payload);
}


function classifyEmail(subject: string): "application" | "round" | "unknown" {
  const s = subject.toLowerCase();

  if (s.includes("registration") || s.includes("super dream") || s.includes("dream") ||
      s.includes("core") || s.includes("internship") || s.includes("placement"))
      return "application";

  if (s.includes("next round") || s.includes("assessment") || 
      s.includes("online test") || s.includes("scheduled") ||
      s.includes("shortlisted") || s.includes("interview") || s.includes("selection process"))
      return "round";

  return "unknown";
}


function shouldProcess(from: string): boolean {
  const allowedSenders = ["blazexnick04@gmail.com"];

  if (!allowedSenders.some((sender) => from.toLowerCase().includes(sender)))
    return false;

  return true;
}

async function buildGeminiPartsWithDocuments(params: {
  messageId: string;
  payload: any;
  accessToken: string;
  baseText: string;
}): Promise<GeminiPart[]> {
  const { messageId, payload, accessToken, baseText } = params;
  const parts: GeminiPart[] = [{ text: baseText }];

  const docParts = await extractDocumentInlineParts(
    messageId,
    payload,
    accessToken
  );

  if (docParts.length) {
    parts.push(...docParts);
  }

  return parts;
}

async function extractDocumentInlineParts(
  messageId: string,
  payload: any,
  accessToken: string
): Promise<GeminiPart[]> {
  const attachments = collectAttachmentParts(payload);
  if (!attachments.length) return [];

  const inlineParts: GeminiPart[] = [];

  for (const part of attachments) {
    if (!isDocumentPart(part)) continue;

    const buffer = await fetchAttachmentBuffer(messageId, part, accessToken);
    if (!buffer) continue;

    if (buffer.length > MAX_INLINE_ATTACHMENT_BYTES) {
      console.warn(
        "Skipping attachment >4MB for Gemini inline data",
        part.filename
      );
      continue;
    }

    inlineParts.push({
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: resolveDocumentMimeType(part),
      },
    });
  }

  return inlineParts;
}

function isDocumentPart(part: any): boolean {
  const mime = (part?.mimeType ?? "").toLowerCase();
  const filename = (part?.filename ?? "").toLowerCase();

  const docMimes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ]);

  const docExtensions = [".pdf", ".doc", ".docx"];

  const hasDocExt = docExtensions.some((ext) => filename.endsWith(ext));

  return docMimes.has(mime) || hasDocExt;
}

function resolveDocumentMimeType(part: any): string {
  const explicit = part?.mimeType;
  if (explicit) return explicit;

  const filename = (part?.filename ?? "").toLowerCase();
  if (filename.endsWith(".pdf")) return "application/pdf";
  if (filename.endsWith(".doc")) return "application/msword";
  if (filename.endsWith(".docx"))
    return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return "application/octet-stream";
}

async function excelAttachmentContainsUserName(
  messageId: string,
  payload: any,
  accessToken: string,
  userName: string
): Promise<boolean> {
  if (!payload) return false;

  const parts = collectAttachmentParts(payload);
  if (!parts.length) return false;

  const needle = userName.toLowerCase();

  for (const part of parts) {
    if (!isExcelPart(part)) continue;

    const buffer = await fetchAttachmentBuffer(messageId, part, accessToken);
    if (!buffer) continue;

    try {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      if (workbookContainsString(workbook, needle)) {
        return true;
      }
    } catch (err) {
      console.warn("Failed to parse Excel attachment", err);
    }
  }

  return false;
}

function collectAttachmentParts(part: any, acc: any[] = []): any[] {
  if (!part) return acc;

  if (part.filename || part.body?.attachmentId) {
    acc.push(part);
  }

  if (Array.isArray(part.parts)) {
    for (const child of part.parts) {
      collectAttachmentParts(child, acc);
    }
  }

  return acc;
}

function isExcelPart(part: any): boolean {
  const mime = (part?.mimeType ?? "").toLowerCase();
  const filename = (part?.filename ?? "").toLowerCase();

  const excelMimes = new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/vnd.ms-excel.sheet.macroenabled.12",
  ]);

  const excelExtensions = [".xlsx", ".xls", ".xlsm", ".xlsb"];

  const hasExcelExt = excelExtensions.some((ext) => filename.endsWith(ext));

  return excelMimes.has(mime) || hasExcelExt;
}

async function fetchAttachmentBuffer(
  messageId: string,
  part: any,
  accessToken: string
): Promise<Buffer | null> {
  const inlineData = part?.body?.data;
  if (inlineData) {
    return decodeBase64Url(inlineData);
  }

  const attachmentId = part?.body?.attachmentId;
  if (!attachmentId) return null;

  const attachmentRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!attachmentRes.ok) {
    console.warn("Failed to fetch attachment", attachmentRes.statusText);
    return null;
  }

  const attachmentJson = await attachmentRes.json();
  if (!attachmentJson?.data) return null;

  return decodeBase64Url(attachmentJson.data);
}

function decodeBase64Url(data: string): Buffer {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4;
  const padded = normalized + (pad ? "=".repeat(4 - pad) : "");
  return Buffer.from(padded, "base64");
}

function workbookContainsString(workbook: XLSX.WorkBook, needle: string): boolean {
  return workbook.SheetNames.some((sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
    return sheetHasNeedle(sheet, needle);
  });
}

function sheetHasNeedle(sheet: XLSX.WorkSheet, needle: string): boolean {
  return Object.keys(sheet).some((cell) => {
    if (cell.startsWith("!")) return false;
    const cellValue = sheet[cell]?.v;
    if (cellValue === undefined || cellValue === null) return false;
    return String(cellValue).toLowerCase().includes(needle);
  });
}
