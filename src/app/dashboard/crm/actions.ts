"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEnquiry(formData: FormData, careHomeId: string) {
  const name = formData.get("name") as string;
  const contactInfo = formData.get("contactInfo") as string;
  const notes = formData.get("notes") as string;

  if (!name || !contactInfo) {
    throw new Error("Name and Contact Info are required");
  }

  await prisma.enquiry.create({
    data: {
      careHomeId,
      name,
      contactInfo,
      notes: notes || null,
      status: "NEW",
    },
  });

  revalidatePath("/dashboard/crm");
}

export async function updateEnquiryStatus(enquiryId: string, status: string) {
  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status },
  });

  revalidatePath("/dashboard/crm");
}
