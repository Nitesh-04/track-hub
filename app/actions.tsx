"use server"

import prisma from "@/utils/db";

type ApplicationData = {
    companyName: string,
    stipend: number,
    role: string,
    ctc: number,
    location: string,
    link: string,
    notifications: boolean
}

export async function createApplication(FormData : ApplicationData,userId:string)
{
    await prisma.application.create({
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
}