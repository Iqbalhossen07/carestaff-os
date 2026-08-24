"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function createStaffMember(formData: FormData, careHomeId: string) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;

  if (!name || !email) {
    throw new Error("Name and Email are required");
  }

  // Generate a default password
  const hashedPassword = await bcrypt.hash("carestaff123", 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      userType: "WORKER",
      careHomeId,
      roleId: roleId || null,
    },
  });

  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard"); // To update total staff count
}
