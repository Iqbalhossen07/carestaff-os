"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function extractPermissions(formData: FormData) {
  return {
    canViewEmar: formData.get("canViewEmar") === "on",
    canEditRota: formData.get("canEditRota") === "on",
    canViewFinance: formData.get("canViewFinance") === "on",
    canManageKitchen: formData.get("canManageKitchen") === "on",
    canManageStaff: formData.get("canManageStaff") === "on",
    canViewResidents: formData.get("canViewResidents") === "on",
    canManageCRM: formData.get("canManageCRM") === "on",
    canManageMessages: formData.get("canManageMessages") === "on",
    canManageMaintenance: formData.get("canManageMaintenance") === "on",
    canManageVisitors: formData.get("canManageVisitors") === "on",
    canManageSafeguarding: formData.get("canManageSafeguarding") === "on",
    canManageReports: formData.get("canManageReports") === "on",
    isSuperAdmin: formData.get("isSuperAdmin") === "on",
  };
}

export async function createRole(formData: FormData, careHomeId: string) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Role name is required");

  await prisma.role.create({
    data: {
      name,
      careHomeId,
      ...extractPermissions(formData),
    },
  });

  revalidatePath("/dashboard/roles");
}

export async function updateRole(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  if (!name) throw new Error("Role name is required");

  await prisma.role.update({
    where: { id },
    data: {
      name,
      ...extractPermissions(formData),
    },
  });

  revalidatePath("/dashboard/roles");
}

export async function deleteRole(id: string) {
  // Prevent deleting roles if users are attached
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } }
  });
  
  if (role && role._count.users > 0) {
    throw new Error("Cannot delete role: There are users assigned to this role.");
  }

  await prisma.role.delete({
    where: { id }
  });

  revalidatePath("/dashboard/roles");
}
