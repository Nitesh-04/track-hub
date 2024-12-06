"use server";

import prisma from "@/utils/db";

export async function getUserByClerkId(clerkid: string) {
  try {
    return await prisma.user.findUnique({
      where: { clerkid },
    });
  } catch (error) {
    console.error("Error fetching user by clerkId:", error);
    throw new Error("Failed to fetch user");
  }
}