"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveResidentMedicationsBulk(data: { 
  residentId: string, 
  medications: any[], 
  deletedIds: string[] 
}) {
  try {
    const { residentId, medications, deletedIds } = data;

    // 1. Delete removed ones
    if (deletedIds.length > 0) {
      await prisma.emarLog.deleteMany({
        where: { medicationId: { in: deletedIds } }
      });
      await prisma.medication.deleteMany({
        where: { id: { in: deletedIds } }
      });
    }

    // 2. Upsert others
    for (const med of medications) {
      const payload = {
        name: med.name,
        dosage: med.dosage,
        route: med.route || "Oral",
        frequency: med.frequency,
        startDate: new Date(med.startDate),
        endDate: med.endDate ? new Date(med.endDate) : null,
        instructions: med.instructions || null,
        status: med.status || "ACTIVE"
      };

      if (med.id && !med.id.startsWith('new-')) {
        // Update existing
        await prisma.medication.update({
          where: { id: med.id },
          data: payload
        });
      } else {
        // Create new
        await prisma.medication.create({
          data: {
            residentId,
            ...payload
          }
        });
      }
    }

    revalidatePath("/dashboard/emar");
    revalidatePath(`/dashboard/emar/resident/${residentId}/manage`);
    return { success: true };
  } catch (error: any) {
    console.error("BULK MANAGE MEDS ERROR:", error);
    return { error: error?.message || "Failed to save changes" };
  }
}
