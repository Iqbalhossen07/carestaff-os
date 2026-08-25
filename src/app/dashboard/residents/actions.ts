"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createResident(data: {
  careHomeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nhsNumber: string;
  roomNumber: string;
  medicalHistory: string;
  allergies: string;
  dietaryReqs: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}) {
  const {
    careHomeId, firstName, lastName, dateOfBirth, nhsNumber, roomNumber,
    medicalHistory, allergies, dietaryReqs, emergencyContactName, emergencyContactPhone
  } = data;

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

export async function updateResident(data: {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nhsNumber: string;
  roomNumber: string;
  medicalHistory: string;
  allergies: string;
  dietaryReqs: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}) {
  const {
    id, firstName, lastName, dateOfBirth, nhsNumber, roomNumber,
    medicalHistory, allergies, dietaryReqs, emergencyContactName, emergencyContactPhone
  } = data;

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
