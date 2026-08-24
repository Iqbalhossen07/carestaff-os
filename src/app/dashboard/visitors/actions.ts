"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function signInVisitor(formData: FormData, careHomeId: string) {
  const name = formData.get("name") as string;
  const purpose = formData.get("purpose") as string;

  if (!name || !purpose) throw new Error("Missing fields");

  await prisma.visitorLog.create({
    data: {
      careHomeId,
      name,
      purpose
    }
  });

  revalidatePath("/dashboard/visitors");
}

export async function signOutVisitor(visitorId: string) {
  await prisma.visitorLog.update({
    where: { id: visitorId },
    data: { signOutTime: new Date() }
  });

  revalidatePath("/dashboard/visitors");
}
