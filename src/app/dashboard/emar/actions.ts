"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMedication(formData: FormData) {
  const residentId = formData.get("residentId") as string;
  const name = formData.get("name") as string;
  const dosage = formData.get("dosage") as string;
  const frequency = formData.get("frequency") as string;
  const route = formData.get("route") as string;

  if (!residentId || !name || !dosage) {
    throw new Error("Missing required fields");
  }

  await prisma.medication.create({
    data: {
      residentId,
      name,
      dosage,
      frequency,
      route,
    },
  });

  revalidatePath("/dashboard/emar");
}

export async function logMedicationAdmin(medicationId: string, residentId: string, staffId: string, status: string, notes?: string) {
  await prisma.emarLog.create({
    data: {
      medicationId,
      residentId,
      administeredById: staffId,
      status,
      notes,
    },
  });

  revalidatePath("/dashboard/emar");
}
