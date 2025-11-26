"use server"

import prisma from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

function isOlderThan7Days(date: Date) {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  return date.getTime() < Date.now() - sevenDaysInMs;
}

export async function checkAutomatorEnabled() {
    const user = await currentUser();

    if (!user) {
        return false;
    }

    const prismaUser = await prisma.user.findUnique({
        where: { clerkid: user.id }
    });

    if (!prismaUser || !prismaUser.updatedAt) {
        return true;
    }

    if(isOlderThan7Days(prismaUser?.updatedAt)) {
        return false;
    }

    return prismaUser?.automatorEnabled;
}