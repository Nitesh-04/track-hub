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
    return NextResponse.json(
      { error: "No credentials for user" },
      { status: 400 }
    );
  }

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
      const subject =
        msgJson.payload.headers.find((h: any) => h.name === "Subject")?.value ||
        "";
      const body = extractBody(msgJson.payload);

      // Filter based on sender
      if (!shouldProcess(fromHeader)) continue;
      console.log(body);


    }

    await prisma.emailCredential.update({
      where: { id: cred.id },
      data: { historyId: historyId.toString() },
    });

    return NextResponse.json({ success: true });
}






// helper functions

function extractBody(payload: any): string {
  if (!payload.parts)
    return Buffer.from(payload.body.data || "", "base64").toString("utf8");

  for (const part of payload.parts) {
    if (part.mimeType === "text/plain") {
      return Buffer.from(part.body.data || "", "base64").toString("utf8");
    }
  }
  return "";
}

function shouldProcess(from: string): boolean {
  const allowedSenders = ["blazexnick04@gmail.com"];

  if (!allowedSenders.some((sender) => from.toLowerCase().includes(sender)))
    return false;

  return true;
}
