"use server";

import prisma from "@/utils/db";
import { ApplicationData} from "@/lib/types";


export async function createApplication(
    formData: ApplicationData,
    userId: string
  ) {
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
          userId: userId,
        },
      });
  
      return createdApplication.id;
    } catch (error) {
      console.error("Error creating application:", error);
      throw new Error("Failed to create application");
    }
  }