import type { Metadata } from "next";
import {
  ClerkProvider
} from '@clerk/nextjs'
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';


export const metadata: Metadata = {
  title: "TrackHub",
  description: "Keep track of your internship applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
