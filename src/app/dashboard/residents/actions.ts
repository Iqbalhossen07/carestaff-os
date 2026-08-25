"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createResident(careHomeId: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const nhsNumber = formData.get("nhsNumber") as string;
  const roomNumber = formData.get("roomNumber") as string;
  
  const medicalHistory = formData.get("medicalHistory") as string;
  const allergies = formData.get("allergies") as string;
  const dietaryReqs = formData.get("dietaryReqs") as string;
  const emergencyContactName = formData.get("emergencyContactName") as string;
  const emergencyContactPhone = formData.get("emergencyContactPhone") as string;

  if (!firstName || !lastName || !dateOfBirth) {
    throw new Error("Missing required fields");
  }

  await prisma.resident.create({
    data: {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      nhsNumber: nhsNumber || null,
      roomNumber: roomNumber || null,
      medicalHistory: medicalHistory || null,
      allergies: allergies || null,
      dietaryReqs: dietaryReqs || null,
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      careHomeId,
    },
  });

  revalidatePath("/dashboard/residents");
  revalidatePath("/dashboard");
  // return true to indicate success instead of redirecting
  return { success: true };
}

export async function deleteResident(id: string) {
  // Delete related records first to avoid foreign key constraints
  await prisma.$transaction([
    prisma.progressNote.deleteMany({ where: { residentId: id } }),
    prisma.medication.deleteMany({ where: { residentId: id } }),
    prisma.emarLog.deleteMany({ where: { residentId: id } }),
    prisma.familyLink.deleteMany({ where: { residentId: id } }),
    prisma.invoice.deleteMany({ where: { residentId: id } }),
    prisma.resident.delete({ where: { id } })
  ]);
  
  revalidatePath("/dashboard/residents");
  return { success: true };
}

export async function updateResident(id: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const nhsNumber = formData.get("nhsNumber") as string;
  const roomNumber = formData.get("roomNumber") as string;

  const medicalHistory = formData.get("medicalHistory") as string;
  const allergies = formData.get("allergies") as string;
  const dietaryReqs = formData.get("dietaryReqs") as string;
  const emergencyContactName = formData.get("emergencyContactName") as string;
  const emergencyContactPhone = formData.get("emergencyContactPhone") as string;

  if (!firstName || !lastName || !dateOfBirth) {
    throw new Error("Missing required fields");
  }

  await prisma.resident.update({
    where: { id },
    data: {
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      nhsNumber: nhsNumber || null,
      roomNumber: roomNumber || null,
      medicalHistory: medicalHistory || null,
      allergies: allergies || null,
      dietaryReqs: dietaryReqs || null,
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
    },
  });

  revalidatePath("/dashboard/residents");
  revalidatePath(`/dashboard/residents/${id}`);
  return { success: true };
}
