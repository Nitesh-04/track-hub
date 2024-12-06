"use server";

import prisma from "@/utils/db";

export async function fetchApplicationByUser(userId: string) {
    try {
      return await prisma.application.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching user applications:", error);
      throw new Error("Failed to fetch user applications");
    }
  }