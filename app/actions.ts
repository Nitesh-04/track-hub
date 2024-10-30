"use server"

import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";

type ApplicationData = {
    companyName: string;
    stipend: number;
    role: string;
    ctc: number;
    location: string;
    link: string;
    notifications: boolean;
}

export type RoundData = {
    roundTitle: string;
    roundDateTime: number;
    venue: string;
    roundLink: string;
    status: "upcoming" | "completed";
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
        revalidatePath(`/view/${applicationId}`);
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
            orderBy: { createdAt: "desc" }
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
            orderBy: { roundDateTime: "desc" }
        });

        const currentTime = new Date();
        const withStatusRounds = rounds.map((round) => {
            if (round.roundDateTime < currentTime) {
                return { ...round, status: "completed" };
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