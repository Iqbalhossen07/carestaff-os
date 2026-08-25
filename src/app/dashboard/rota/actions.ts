"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ShiftStatus } from "@prisma/client";

export async function createShift(data: any) {
  try {
    const { careHomeId, title, startTime, endTime, assignedToId, notes } = data;

    if (!title || !startTime || !endTime) {
      return { error: "Missing required fields" };
    }

    await prisma.shift.create({
      data: {
        careHomeId,
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        assignedToId: assignedToId || null,
        isOpen: !assignedToId,
        notes: notes || null,
        status: "SCHEDULED",
      },
    });

    revalidatePath("/dashboard/rota");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("CREATE SHIFT ERROR:", error);
    return { error: error?.message || "Failed to create shift" };
  }
}

export async function updateShift(id: string, data: any) {
  try {
    const { title, startTime, endTime, assignedToId, notes, status } = data;

    if (!title || !startTime || !endTime) {
      return { error: "Missing required fields" };
    }

    await prisma.shift.update({
      where: { id },
      data: {
        title,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        assignedToId: assignedToId || null,
        isOpen: !assignedToId,
        notes: notes || null,
        status: status || "SCHEDULED",
      },
    });

    revalidatePath("/dashboard/rota");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("UPDATE SHIFT ERROR:", error);
    return { error: error?.message || "Failed to update shift" };
  }
}

export async function assignShift(shiftId: string, assignedToId: string) {
  try {
    await prisma.shift.update({
      where: { id: shiftId },
      data: {
        assignedToId,
        isOpen: false,
        status: "SCHEDULED",
      }
    });

    revalidatePath("/dashboard/rota");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to assign shift" };
  }
}

export async function deleteShift(id: string) {
  try {
    await prisma.shift.delete({
      where: { id }
    });
    revalidatePath("/dashboard/rota");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    return { error: error?.message || "Failed to delete shift" };
  }
}
