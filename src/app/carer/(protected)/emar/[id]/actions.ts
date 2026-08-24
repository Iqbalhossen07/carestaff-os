"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function logMedication(
  medicationId: string, 
  residentId: string, 
  status: "ADMINISTERED" | "REFUSED" | "MISSED",
  refusalReason?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Basic check to see if already logged today to prevent duplicates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingLog = await prisma.emarLog.findFirst({
    where: {
      medicationId,
      residentId,
      timestamp: { gte: today }
    }
  });

  if (existingLog) {
    throw new Error("This medication has already been logged today.");
  }

  await prisma.emarLog.create({
    data: {
      medicationId,
      residentId,
      status,
      refusalReason: refusalReason || null,
      administeredById: session.user.id
    }
  });

  revalidatePath(`/carer/emar/${residentId}`);
  revalidatePath(`/carer/emar`);
  return { success: true };
}
