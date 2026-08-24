"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reportIncident(formData: FormData, careHomeId: string, reportedById: string) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;

  if (!title || !description || !severity) throw new Error("Missing fields");

  await prisma.incidentReport.create({
    data: {
      careHomeId,
      title,
      description,
      severity,
      reportedById
    }
  });

  revalidatePath("/dashboard/incidents");
}
