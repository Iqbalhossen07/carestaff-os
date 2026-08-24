"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addHandover(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const notes = formData.get("notes") as string;
  if (!notes || notes.trim().length === 0) {
    throw new Error("Handover notes cannot be empty");
  }

  await prisma.handover.create({
    data: {
      notes,
      authorId: session.user.id
    }
  });

  revalidatePath("/carer/handovers");
  return { success: true };
}
