"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCareHomeSettings(careHomeId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const address = formData.get("address") as string;
  const branchCode = formData.get("branchCode") as string;

  if (!name || !branchCode) {
    throw new Error("Name and Branch Code are required");
  }

  await prisma.careHome.update({
    where: { id: careHomeId },
    data: {
      name,
      address,
      branchCode,
    },
  });

  revalidatePath("/dashboard/settings");
}
