"use server";

import prisma from "@/utils/db";

export async function checkUser(
  clerkid: string,
  email: string,
  name: string,
  githubid?: string
) {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ clerkid }, { email }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists with this clerkId or email",
        data: null,
      };
    }

    const newUser = await prisma.user.create({
      data: {
        clerkid,
        email,
        name,
        githubid: githubid ?? null,
      },
    });

    return {
      success: true,
      data: newUser,
      error: null,
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      error: "Failed to register user",
      data: null,
    };
  }
}

export async function fetchUpcomingRoundsByUser(userId: string) {
  try {
    return await prisma.round.findMany({
      where: {
        userId,
        roundDateTime: {
          gte: new Date(),
        },
      },
      include: { application: true },
      orderBy: { roundDateTime: "asc" },
    });
  } catch (error) {
    console.error("Error fetching upcoming rounds count:", error);
    throw new Error("Failed to fetch upcoming rounds count");
  }
}

export async function fetchRecentApplicationsByUser(userId: string) {
  try {
      return await prisma.application.findMany({
          where: { userId },
          orderBy: { updatedAt: "desc" },
          take: 3
      });
  } catch (error) {
      console.error("Error fetching recent applications:", error);
      throw new Error("Failed to fetch recent applications");
  }
}