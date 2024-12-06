"use server";

import prisma from "@/utils/db";

export async function setGithubId(clerkid: string, githubid: string) {
  try {
    await prisma.user.update({
      where: { clerkid },
      data: {
        githubid,
      },
    });
  } catch (error) {
    console.error("Error setting github id:", error);
    throw new Error("Failed to set github id");
  }
}

export async function fetchTotalApplicationsByUser(userId: string) {
  try {
    return await prisma.application.count({
      where: { userId },
    });
  } catch (error) {
    console.error("Error fetching total applications:", error);
    throw new Error("Failed to fetch total applications");
  }
}

export async function fetchTotalRoundsByUser(userId: string) {
  try {
    return await prisma.round.count({
      where: { userId },
    });
  } catch (error) {
    console.error("Error fetching total rounds:", error);
    throw new Error("Failed to fetch total rounds");
  }
}

export async function fetchUpcomingRoundsCountByUser(userId: string) {
  try {
    return await prisma.round.count({
      where: {
        userId,
        roundDateTime: {
          gte: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching upcoming rounds count:", error);
    throw new Error("Failed to fetch upcoming rounds count");
  }
}
