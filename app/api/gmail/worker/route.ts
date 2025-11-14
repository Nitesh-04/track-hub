import { NextResponse } from "next/server";
import prisma from "@/utils/db";

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
    return NextResponse.json({ error: "No credentials for user" }, { status: 400 });
  }

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

  await prisma.emailCredential.update({
    where: { id: cred.id },
    data: { historyId: historyId.toString() },
  });

  if (!historyJson.history) {
    console.log("No new history");
    return NextResponse.json({ ok: true });
  }

  const messageIds = new Array<string>();

  for (const record of historyJson.history) {
    if (record.messagesAdded) {
      for (const m of record.messagesAdded) {
        messageIds.push(m.message.id);
      }
    }
  }

  for (const id of messageIds) {
    const msgRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const msgJson = await msgRes.json();

    const fromHeader = msgJson.payload.headers.find((h: any) => h.name === "From")?.value || "";
    const subject = msgJson.payload.headers.find((h: any) => h.name === "Subject")?.value || "";
    const body = extractBody(msgJson.payload);

    // Filter based on sender / subject
    // if (!shouldProcess(fromHeader, subject, body)) continue;

    console.log(body);

    // Parse job data
    //const parsed = parseJobEmail({ fromHeader, subject, body });


    // const app = await prisma.application.create({
    //   data: {
    //     companyName: parsed.company,
    //     role: parsed.role,
    //     location: parsed.location || "",
    //     link: parsed.link || "",
    //     userId: clerkid,
    //   },
    // });

    // if (parsed.round) {
    //   await prisma.round.create({
    //     data: {
    //       roundTitle: parsed.round.title,
    //       roundDateTime: parsed.round.date,
    //       venue: parsed.round.venue || "",
    //       status: "upcoming",
    //       applicationId: app.id,
    //       userId: clerkid,
    //     },
    //   });
    // }
  }

  await prisma.emailCredential.update({
    where: { id: cred.id },
    data: { historyId },
  });

  return NextResponse.json({ success: true });
}

function extractBody(payload: any): string {
  if (!payload.parts) return Buffer.from(payload.body.data || "", "base64").toString("utf8");

  for (const part of payload.parts) {
    if (part.mimeType === "text/plain") {
      return Buffer.from(part.body.data || "", "base64").toString("utf8");
    }
  }
  return "";
}

function shouldProcess(from: string, subject: string, body: string) {
  const allowedSenders = [
    "blazexnick04@gmail.com",
    "jobs-noreply@linkedin.com",
    "careers@", // partial match allowed
  ];

  if (!allowedSenders.some(sender => from.toLowerCase().includes(sender)))
    return false;

  if (
    !subject.toLowerCase().match(/interview|assessment|round|selected|shortlist/)
  )
    return false;

  return true;
}

// function parseJobEmail({ fromHeader, subject, body }) {
//   return {
//     company: extractCompany(subject, body),
//     role: extractRole(subject, body),
//     link: extractLink(body),
//     location: null,
//     round: extractRoundInfo(body),
//   };
// }