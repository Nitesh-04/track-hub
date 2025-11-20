import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/utils/db";

export async function GET(req: Request) {
  const url = new URL(req.url);

  
  const user = await currentUser();
  const userId = user?.id;

  const clerkUserId = userId;

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
  }

  // Validate state cookie
  const cookieStore = cookies();
  const storedState = cookieStore.get("google_oauth_state")?.value;

  if (!storedState || storedState !== state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  cookieStore.set("google_oauth_state", "", { maxAge: 0 });

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
      code,
    }),
  });

  const tokenJson = await tokenRes.json();
  console.log("Token Response:", tokenJson);

  if (!tokenJson.access_token) {
    return NextResponse.json(
      { error: "Token exchange failed", details: tokenJson },
      { status: 500 }
    );
  }

  const { access_token, refresh_token, expires_in, scope, token_type } = tokenJson;

  // Fetch Google Profile (email)
  const meRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  const googleUser = await meRes.json();
  console.log("Google User:", googleUser);

  if (!googleUser.email) {
    return NextResponse.json({ error: "No email from Google" }, { status: 500 });
  }

  if (!clerkUserId) {
    return NextResponse.json({ error: "User not signed in" }, { status: 401 });
  }

  // Map Clerk user → Prisma User
  const prismaUser = await prisma.user.findUnique({
    where: { clerkid: clerkUserId },
  });

  if(!prismaUser) {
    return NextResponse.json(
      { error: "Prisma user not found" },
      { status: 404 }
    );
  }

  // Prepare expiry date
  const expiresAt = expires_in
    ? new Date(Date.now() + expires_in * 1000)
    : null;

  // Store tokens in Prisma (update or create)
  const existingEmailCredential = await prisma.emailCredential.findFirst({
    where: { clerkid: prismaUser.clerkid },
  });

  if (existingEmailCredential) {
    await prisma.emailCredential.update({
      where: { id: existingEmailCredential.id },
      data: {
        accessToken: access_token,
        refreshToken: refresh_token || existingEmailCredential.refreshToken,
        scope,
        tokenType: token_type,
        expiresAt,
      },
    });
  } else {
    await prisma.emailCredential.create({
      data: {
        clerkid: prismaUser.clerkid,
        provider: "google",
        accessToken: access_token,
        refreshToken: refresh_token ?? "",
        scope,
        tokenType: token_type,
        expiresAt,
      },
    });
  }

  await prisma.user.update({
    where: { clerkid: prismaUser.clerkid },
    data: { automatorEnabled: true },
  })


  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?enabledAutomation=true`);
}
