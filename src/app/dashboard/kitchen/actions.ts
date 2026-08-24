"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateDietaryProfile(residentId: string, formData: FormData) {
  const dietaryNeeds = formData.get("dietaryNeeds") as string;
  const allergies = formData.get("allergies") as string;

  await prisma.resident.update({
    where: { id: residentId },
    data: {
      dietaryNeeds,
      allergies,
    },
  });

  revalidatePath("/dashboard/kitchen");
}
