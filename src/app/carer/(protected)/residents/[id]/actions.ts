"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addProgressNote(residentId: string, formData: FormData) {
  const note = formData.get("note") as string;
  const mood = formData.get("mood") as string;
  const foodIntake = formData.get("foodIntake") as string;

  if (!note || note.trim().length === 0) {
    throw new Error("Progress note cannot be empty.");
  }

  await prisma.progressNote.create({
    data: {
      residentId,
      note,
      mood: mood || null,
      foodIntake: foodIntake || null,
    }
  });

  revalidatePath(`/carer/residents/${residentId}`);
  return { success: true };
}
