"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEnquiry(data: any) {
  try {
    const {
      careHomeId, firstName, lastName, contactName, contactPhone, contactEmail, careRequired, notes
    } = data;

    if (!firstName || !lastName || !careHomeId) {
      return { error: "Missing required fields" };
    }

    await prisma.enquiry.create({
      data: {
        careHomeId,
        firstName,
        lastName,
        contactName: contactName || null,
        contactPhone: contactPhone || null,
        contactEmail: contactEmail || null,
        careRequired: careRequired || null,
        notes: notes || null,
        status: "New"
      }
    });

    revalidatePath("/dashboard/crm");
    return { success: true };
  } catch (error: any) {
    console.error("CREATE ENQUIRY ERROR:", error);
    return { error: error?.message || "Failed to create enquiry" };
  }
}

export async function updateEnquiry(id: string, data: any) {
  try {
    const {
      firstName, lastName, contactName, contactPhone, contactEmail, careRequired, notes, status
    } = data;

    await prisma.enquiry.update({
      where: { id },
      data: {
        firstName,
        lastName,
        contactName: contactName || null,
        contactPhone: contactPhone || null,
        contactEmail: contactEmail || null,
        careRequired: careRequired || null,
        notes: notes || null,
        status: status || "New"
      }
    });

    revalidatePath("/dashboard/crm");
    return { success: true };
  } catch (error: any) {
    console.error("UPDATE ENQUIRY ERROR:", error);
    return { error: error?.message || "Failed to update enquiry" };
  }
}

export async function updateEnquiryStatus(id: string, status: string) {
  try {
    await prisma.enquiry.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/dashboard/crm");
    return { success: true };
  } catch (error: any) {
    console.error("UPDATE STATUS ERROR:", error);
    return { error: error?.message || "Failed to update status" };
  }
}

export async function deleteEnquiry(id: string) {
  try {
    await prisma.enquiry.delete({
      where: { id }
    });
    revalidatePath("/dashboard/crm");
    return { success: true };
  } catch (error: any) {
    console.error("DELETE ENQUIRY ERROR:", error);
    return { error: error?.message || "Failed to delete enquiry" };
  }
}
