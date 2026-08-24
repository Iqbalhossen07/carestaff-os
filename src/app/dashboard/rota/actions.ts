"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createShift(formData: FormData, careHomeId: string) {
  const roleRequired = formData.get("roleRequired") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const userId = formData.get("userId") as string;

  if (!roleRequired || !startTime || !endTime) {
    throw new Error("Missing required fields");
  }

  await prisma.shift.create({
    data: {
      careHomeId,
      roleRequired,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      userId: userId || null,
      status: userId ? "ASSIGNED" : "OPEN",
    },
  });

  revalidatePath("/dashboard/rota");
  revalidatePath("/dashboard"); // To update the open shifts count
}

export async function assignShift(shiftId: string, userId: string) {
  await prisma.shift.update({
    where: { id: shiftId },
    data: {
      userId,
      status: "ASSIGNED",
    }
  });

  revalidatePath("/dashboard/rota");
  revalidatePath("/dashboard");
}
