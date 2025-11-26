import { cookies } from "next/headers";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function GET() {
  const state = crypto.randomBytes(16).toString("hex");

  cookies().set({
    name: "google_oauth_state",
    value: state,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

  const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/gmail.labels"
  ].join(" ");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    access_type: "offline",  
    prompt: "consent",  
    state
  });

  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  return NextResponse.redirect(redirectUrl);
}
