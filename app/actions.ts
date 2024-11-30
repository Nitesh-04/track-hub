"use server"

import prisma from "@/utils/db";
import { ApplicationData, RoundData } from "@/lib/types";

export async function registerUser(
    clerkid: string,
    email: string,
    name: string,
    githubid?: string,
  ) {
    try {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { clerkid },
            { email }
          ]
        }
      });
  
      if (existingUser) {
        return { 
          success: false, 
          error: 'User already exists with this clerkId or email',
          data: null 
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
        error: null
      };
    } catch (error) {
      console.error('Error registering user:', error);
      return { 
        success: false, 
        error: 'Failed to register user',
        data: null 
      };
    }
  }

  export async function getUserByClerkId(clerkid: string) {
    try {
      return await prisma.user.findUnique({
        where: { clerkid }
      });
    } catch (error) {
      console.error('Error fetching user by clerkId:', error);
      throw new Error('Failed to fetch user');
    }
  }

  export async function setGithubId(clerkid: string, githubid: string) {
    try {
        await prisma.user.update({
            where: { clerkid },
            data: {
                githubid
            }
        });
    } catch (error) {
        console.error("Error setting github id:", error);
        throw new Error("Failed to set github id");
    }
}

export async function fetchTotalApplicationsByUser(userId: string) {
    try {
        return await prisma.application.count({
            where: { userId }
        });
    } catch (error) {
        console.error("Error fetching total applications:", error);
        throw new Error("Failed to fetch total applications");
    }
}

export async function fetchTotalRoundsByUser(userId: string) {
    try {
        return await prisma.round.count({
            where: { userId }
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
                    gte: new Date()
                }
            }
        });
    } catch (error) {
        console.error("Error fetching upcoming rounds count:", error);
        throw new Error("Failed to fetch upcoming rounds count");
    }
}

export async function createApplication(formData: ApplicationData, userId: string) {
    try {
        const createdApplication = await prisma.application.create({
            data: {
                companyName: formData.companyName,
                stipend: formData.stipend,
                role: formData.role,
                ctc: formData.ctc,
                location: formData.location,
                link: formData.link,
                notifications: formData.notifications,
                userId: userId
            }
        });

        return createdApplication.id;
    } catch (error) {
        console.error("Error creating application:", error);
        throw new Error("Failed to create application");
    }
}

export async function createRound(formData: RoundData, applicationId: string, userId: string) {

    try {
        await prisma.round.create({
            data: {
                roundTitle: formData.roundTitle,
                roundDateTime: new Date(formData.roundDateTime),
                venue: formData.venue,
                roundLink: formData.roundLink,
                status: formData.status,
                applicationId: applicationId,
                userId: userId
            }
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
            orderBy: { updatedAt: "desc" }
        });
    } catch (error) {
        console.error("Error fetching user applications:", error);
        throw new Error("Failed to fetch user applications");
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

export async function fetchRoundByApplicationId(applicationId: string) {
    try {
        const rounds = await prisma.round.findMany({
            where: { applicationId },
            orderBy: { roundDateTime: "desc" }
        });

        const currentTime = new Date();
        const withStatusRounds = rounds.map((round) => {
            if (round.roundDateTime < currentTime) {
                return { ...round, status: "completed" };
            }
            else if (round.roundDateTime > currentTime) {
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
            orderBy: { roundDateTime: "desc" }
        });
    } catch (error) {
        console.error("Error fetching user rounds:", error);
        throw new Error("Failed to fetch user rounds");
    }
}

export async function fetchUpcomingRoundsByUser(userId: string) {
    try {
        return await prisma.round.findMany({
            where: {
                userId,
                roundDateTime: {
                    gte: new Date()
                }
            },
            include: { application: true },
            orderBy: { roundDateTime: "asc" }
        });
    } catch (error) {
        console.error("Error fetching upcoming rounds count:", error);
        throw new Error("Failed to fetch upcoming rounds count");
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
                notifications: formData.notifications
            }
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
                status: formData.status
            }
        });
    } catch (error) {
        console.error("Error updating round:", error);
        throw new Error("Failed to update round");
    }
}

export async function deletedApplication(id: string) {
    try {
        await prisma.application.delete({
            where: { id }
        });
    } catch (error) {
        console.error("Error deleting application:", error);
        throw new Error("Failed to delete application");
    }
}

export async function deleteRound(id: string) {
    try {
        await prisma.round.delete({
            where: { id }
        });
    } catch (error) {
        console.error("Error deleting round:", error);
        throw new Error("Failed to delete round");
    }
}