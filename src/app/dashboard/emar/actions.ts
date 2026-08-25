"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMedication(data: any) {
  try {
    const { residentId, name, dosage, frequency, instructions } = data;

    if (!residentId || !name || !dosage) {
      return { error: "Missing required fields" };
    }

    await prisma.medication.create({
      data: {
        residentId,
        name,
        dosage,
        frequency,
        instructions: instructions || null,
      },
    });

    revalidatePath("/dashboard/emar");
    return { success: true };
  } catch (error: any) {
    console.error("ADD MEDICATION ERROR:", error);
    return { error: error?.message || "Failed to add medication" };
  }
}

export async function updateMedication(id: string, data: any) {
  try {
    const { name, dosage, frequency, instructions } = data;

    if (!name || !dosage) {
      return { error: "Missing required fields" };
    }

    await prisma.medication.update({
      where: { id },
      data: {
        name,
        dosage,
        frequency,
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
    // Delete associated logs first to avoid foreign key constraint errors
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
