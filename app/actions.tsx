"use server"

import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";

type ApplicationData = {
    companyName: string,
    stipend: number,
    role: string,
    ctc: number,
    location: string,
    link: string,
    notifications: boolean
}

export type RoundData = {
    roundTitle: string,
    roundDateTime: number,
    venue: string,
    roundLink: string,
    status: "upcoming",
}

export async function createApplication(FormData : ApplicationData,userId:string)
{
    const createdApplication = await prisma.application.create({
        data: {
            companyName: FormData.companyName,
            stipend: FormData.stipend,
            role: FormData.role,
            ctc: FormData.ctc,
            location: FormData.location,
            link: FormData.link,
            notifications: FormData.notifications,
            userId: userId
        }
    });

    return createdApplication.id;
}

export async function createRound(FormData: RoundData, applicationId: string, userId: string) {
    try {
        await prisma.round.create({
            data: {
                roundTitle: FormData.roundTitle,
                roundDateTime: new Date(FormData.roundDateTime),
                venue: FormData.venue,
                roundLink: FormData.roundLink,
                status: FormData.status,
                applicationId: applicationId,
                userId: userId
            }
        });
        revalidatePath(`/view/${applicationId}`);
    } catch (error) {
        throw new Error("Failed to create round");
    }
}

export async function fetchApplicationById(id: string) {
    const data = await prisma.application.findUnique({
        where: { id },
        include: { rounds: true }
    });
}

export async function fetchApplicationByUser(userId:string)
{
    return await prisma.application.findMany({
        where: {userId},
        orderBy: {createdAt: "desc"}
    });
}

export async function fetchRoundByApplication(applicationId:string)
{
    return await prisma.round.findMany({
        where: {applicationId},
        orderBy: {roundDateTime: "desc"}
    });
}

export async function fetchRoundsByUser(userId:string)
{
    return await prisma.round.findMany({
        where: {userId},
        orderBy: {roundDateTime: "desc"}
    });
}