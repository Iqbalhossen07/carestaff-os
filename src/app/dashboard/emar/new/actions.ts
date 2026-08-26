"use server"

import prisma from "@/lib/prisma";

export async function getResidentMedications(residentId: string) {
  try {
    const meds = await prisma.medication.findMany({
      where: { 
        residentId,
        status: "ACTIVE"
      },
      orderBy: { createdAt: 'desc' }
    });
    return { meds };
  } catch (error: any) {
    return { error: error.message };
  }
}
