"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function reportIncident(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;

  if (!title || !description || !severity) {
    throw new Error("All fields are required");
  }

  await prisma.incidentReport.create({
    data: {
      title,
      description,
      severity,
      careHomeId: session.user.careHomeId as string,
      reportedById: session.user.id
    }
  });

  revalidatePath("/carer/incidents");
  return { success: true };
}
