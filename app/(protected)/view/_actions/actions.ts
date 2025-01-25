"use server";

import prisma from "@/utils/db";
import { ApplicationData, RoundData } from "@/lib/types";

export async function createRound(
  formData: RoundData,
  applicationId: string,
  userId: string
) {
  try {
    await prisma.round.create({
      data: {
        roundTitle: formData.roundTitle,
        roundDateTime: new Date(formData.roundDateTime),
        venue: formData.venue,
        roundLink: formData.roundLink,
        status: formData.status,
        applicationId: applicationId,
        userId: userId,
      },
    });
  } catch (error) {
    console.error("Error creating round:", error);
    throw new Error("Failed to create round");
  }
}

export async function fetchApplicationById(id: string) {
  try {
    return await prisma.application.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    throw new Error("Failed to fetch application");
  }
}

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

export async function fetchRoundByApplicationId(applicationId: string) {
  try {
    const rounds = await prisma.round.findMany({
      where: { applicationId },
      orderBy: { roundDateTime: "desc" },
    });

    const currentTime = new Date();
    const withStatusRounds = rounds.map((round) => {
      if (round.roundDateTime < currentTime) {
        return { ...round, status: "completed" };
      } else if (round.roundDateTime > currentTime) {
        return { ...round, status: "upcoming" };
      }
      return round;
    });

    return withStatusRounds;
  } catch (error) {
    console.error("Error fetching rounds:", error);
    throw new Error("Failed to fetch rounds");
  }
}

export async function fetchRoundsByUser(userId: string) {
  try {
    return await prisma.round.findMany({
      where: { userId },
      orderBy: { roundDateTime: "desc" },
    });
  } catch (error) {
    console.error("Error fetching user rounds:", error);
    throw new Error("Failed to fetch user rounds");
  }
}

export async function updateApplication(id: string, formData: ApplicationData) {
  try {
    await prisma.application.update({
      where: { id },
      data: {
        companyName: formData.companyName,
        stipend: formData.stipend,
        role: formData.role,
        ctc: formData.ctc,
        location: formData.location,
        link: formData.link,
        notifications: formData.notifications,
      },
    });
  } catch (error) {
    console.error("Error updating application:", error);
    throw new Error("Failed to update application");
  }
}

export async function updateRound(id: string, formData: RoundData) {
  try {
    await prisma.round.update({
      where: { id },
      data: {
        roundTitle: formData.roundTitle,
        roundDateTime: new Date(formData.roundDateTime),
        venue: formData.venue,
        roundLink: formData.roundLink,
        status: formData.status,
      },
    });
  } catch (error) {
    console.error("Error updating round:", error);
    throw new Error("Failed to update round");
  }
}

export async function deletedApplication(id: string) {
  try {
    await prisma.application.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting application:", error);
    throw new Error("Failed to delete application");
  }
}

export async function deleteRound(id: string) {
  try {
    await prisma.round.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting round:", error);
    throw new Error("Failed to delete round");
  }
}
