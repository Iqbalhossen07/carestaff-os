"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMedication(formData: FormData) {
  const residentId = formData.get("residentId") as string;
  const name = formData.get("name") as string;
  const dosage = formData.get("dosage") as string;
  const frequency = formData.get("frequency") as string;
  const instructions = formData.get("instructions") as string;

  if (!residentId || !name || !dosage) {
    throw new Error("Missing required fields");
  }

  await prisma.medication.create({
    data: {
      residentId,
      name,
      dosage,
      frequency,
      instructions,
    },
  });

  revalidatePath("/dashboard/emar");
}

export async function logMedicationAdmin(medicationId: string, residentId: string, staffId: string, status: "ADMINISTERED" | "REFUSED" | "MISSED", refusalReason?: string) {
  await prisma.emarLog.create({
    data: {
      medicationId,
      residentId,
      administeredById: staffId,
      status,
      refusalReason,
    },
  });

  revalidatePath("/dashboard/emar");
}
