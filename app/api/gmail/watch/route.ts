import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST() {
  const user = await currentUser();
  const clerkUserId = user?.id;


  if (!clerkUserId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const cred = await prisma.emailCredential.findFirst({
    where: { clerkid: clerkUserId },
  });

  if (!cred) {
    return NextResponse.json({ error: "No Gmail connected" }, { status: 400 });
  }

  // Refresh access token if needed
  if (cred.expiresAt && cred.expiresAt < new Date()) {
    const refresh = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: cred.refreshToken,
      }),
    });

    const r = await refresh.json();

    if (r.access_token) {
      await prisma.emailCredential.update({
        where: { id: cred.id },
        data: {
          accessToken: r.access_token,
          expiresAt: new Date(Date.now() + r.expires_in * 1000),
        },
      });
      cred.accessToken = r.access_token;
    }
  }

  // Register Gmail Watch
  const watchRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/watch",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cred.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topicName: process.env.GMAIL_PUBSUB_TOPIC!,
        labelIds: ["INBOX"], 
      }),
    }
  );

  const watchJson = await watchRes.json();

  if (!watchJson.historyId) {
    return NextResponse.json(
      { error: "watch_failed", details: watchJson },
      { status: 500 }
    );
  }

  // Save historyId
  await prisma.emailCredential.update({
    where: { id: cred.id },
    data: {
      historyId: watchJson.historyId,
    },
  });

  return NextResponse.json({ success: true });
}
