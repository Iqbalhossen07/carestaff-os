"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRole(formData: FormData, careHomeId: string) {
  const name = formData.get("name") as string;
  const canViewEmar = formData.get("canViewEmar") === "on";
  const canEditRota = formData.get("canEditRota") === "on";
  const canViewFinance = formData.get("canViewFinance") === "on";
  const canManageKitchen = formData.get("canManageKitchen") === "on";
  const isSuperAdmin = formData.get("isSuperAdmin") === "on";

  if (!name) {
    throw new Error("Role name is required");
  }

  await prisma.role.create({
    data: {
      name,
      careHomeId,
      canViewEmar,
      canEditRota,
      canViewFinance,
      canManageKitchen,
      isSuperAdmin,
    },
  });

  revalidatePath("/dashboard/roles");
}
