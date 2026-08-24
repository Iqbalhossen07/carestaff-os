"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createShift(formData: FormData, careHomeId: string) {
  const title = formData.get("title") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const assignedToId = formData.get("assignedToId") as string;

  if (!title || !startTime || !endTime) {
    throw new Error("Missing required fields");
  }

  await prisma.shift.create({
    data: {
      careHomeId,
      title,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      assignedToId: assignedToId || null,
      status: assignedToId ? "SCHEDULED" : "SCHEDULED", isOpen: assignedToId ? false : true,
    },
  });

  revalidatePath("/dashboard/rota");
  revalidatePath("/dashboard"); // To update the open shifts count
}

export async function assignShift(shiftId: string, assignedToId: string) {
  await prisma.shift.update({
    where: { id: shiftId },
    data: {
      assignedToId,
      status: "SCHEDULED", isOpen: false,
    }
  });

  revalidatePath("/dashboard/rota");
  revalidatePath("/dashboard");
}
