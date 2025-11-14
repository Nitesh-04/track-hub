import { NextResponse } from "next/server";
import prisma from "@/utils/db";

export async function POST(req: Request) {
  const body = await req.json();

  // Pub/Sub wraps the Gmail payload in base64
  const pubsubMessage = body?.message?.data;

  if (!pubsubMessage) {
    return NextResponse.json({ error: "No message data" }, { status: 400 });
  }

  // Decode base64
  const decoded = JSON.parse(
    Buffer.from(pubsubMessage, "base64").toString("utf-8")
  );

  console.log("Decoded Gmail Push:", decoded);

  const emailAddress = decoded.emailAddress;
  const historyId = decoded.historyId;

  if (!emailAddress || !historyId) {
    return NextResponse.json(
      { error: "Invalid Gmail push structure" },
      { status: 400 }
    );
  }

  const prismaUser = await prisma.user.findUnique({
    where: { email: emailAddress },
  });

  if (!prismaUser) {
    console.log("No TrackHub user linked to this Gmail:", emailAddress);
    return NextResponse.json({ ok: true });
  }


  // Trigger worker to fetch new emails (job system)

  fetch(`${process.env.INTERNAL_WORKER_URL}/api/gmail/worker`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clerkid: prismaUser.clerkid,
      historyId: historyId.toString(),
    }),
  }).catch((err) => console.error("Worker call failed", err));

  return NextResponse.json({ success: true });
}
