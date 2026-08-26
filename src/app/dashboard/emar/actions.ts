"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMultipleMedications(data: { residentId: string, medications: any[] }) {
  try {
    const { residentId, medications } = data;

    if (!residentId || !medications || medications.length === 0) {
      return { error: "Missing required fields" };
    }

    const payload = medications.map(med => ({
      residentId,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      route: med.route || "Oral",
      mealInstruction: med.mealInstruction || null,
      startDate: new Date(med.startDate),
      endDate: med.endDate ? new Date(med.endDate) : null,
      instructions: med.instructions || null,
      status: "ACTIVE"
    }));

    await prisma.medication.createMany({
      data: payload
    });

    revalidatePath("/dashboard/emar");
    return { success: true };
  } catch (error: any) {
    console.error("ADD MULTIPLE MEDICATIONS ERROR:", error);
    return { error: error?.message || "Failed to add medications" };
  }
}

export async function updateMedication(id: string, data: any) {
  try {
    const { name, dosage, frequency, route, mealInstruction, startDate, endDate, status, instructions } = data;

    if (!name || !dosage) {
      return { error: "Missing required fields" };
    }

    await prisma.medication.update({
      where: { id },
      data: {
        name,
        dosage,
        frequency,
        route,
        mealInstruction: mealInstruction || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        instructions: instructions || null,
      },
    });

    revalidatePath("/dashboard/emar");
    return { success: true };
  } catch (error: any) {
    console.error("UPDATE MEDICATION ERROR:", error);
    return { error: error?.message || "Failed to update medication" };
  }
}

export async function deleteMedication(id: string) {
  try {
    await prisma.emarLog.deleteMany({
      where: { medicationId: id }
    });

    await prisma.medication.delete({
      where: { id }
    });
    
    revalidatePath("/dashboard/emar");
    return { success: true };
  } catch (error: any) {
    console.error("DELETE MEDICATION ERROR:", error);
    return { error: error?.message || "Failed to delete medication" };
  }
}

export async function logMedicationAdmin(data: any) {
  try {
    const { medicationId, residentId, staffId, status, refusalReason } = data;
    
    if (!medicationId || !residentId || !staffId || !status) {
      return { error: "Missing required fields" };
    }

    await prisma.emarLog.create({
      data: {
        medicationId,
        residentId,
        administeredById: staffId,
        status,
        refusalReason: refusalReason || null,
      },
    });

    revalidatePath("/dashboard/emar");
    revalidatePath(`/dashboard/emar/${medicationId}`);
    return { success: true };
  } catch (error: any) {
    console.error("LOG MEDICATION ERROR:", error);
    return { error: error?.message || "Failed to log medication administration" };
  }
}
