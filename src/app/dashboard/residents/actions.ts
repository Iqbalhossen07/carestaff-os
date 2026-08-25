"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  try {
    const {
      careHomeId, firstName, lastName, dateOfBirth, nhsNumber, roomNumber,
      medicalHistory, allergies, dietaryReqs, emergencyContactName, emergencyContactPhone
    } = data;

    if (!firstName || !lastName || !dateOfBirth) {
      return { error: "Missing required fields" };
    }

    if (!careHomeId) {
      return { error: "Care Home ID is missing from session. Cannot create resident." };
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
  } catch (error: any) {
    console.error("CREATE RESIDENT ERROR:", error);
    return { error: error?.message || "Database error occurred while creating resident" };
  }
}

export async function deleteResident(id: string) {
  try {
    // Delete related records first to avoid foreign key constraints
    await prisma.$transaction([
      prisma.emarLog.deleteMany({ where: { residentId: id } }),
      prisma.progressNote.deleteMany({ where: { residentId: id } }),
      prisma.medication.deleteMany({ where: { residentId: id } }),
      prisma.familyLink.deleteMany({ where: { residentId: id } }),
      prisma.invoice.deleteMany({ where: { residentId: id } }),
      prisma.resident.delete({ where: { id } })
    ]);
    
    revalidatePath("/dashboard/residents");
    return { success: true };
  } catch (error: any) {
    console.error("DELETE RESIDENT ERROR:", error);
    return { error: error?.message || "Database error occurred while deleting resident" };
  }
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
  try {
    const {
      id, firstName, lastName, dateOfBirth, nhsNumber, roomNumber,
      medicalHistory, allergies, dietaryReqs, emergencyContactName, emergencyContactPhone
    } = data;

    if (!firstName || !lastName || !dateOfBirth) {
      return { error: "Missing required fields" };
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
  } catch (error: any) {
    console.error("UPDATE RESIDENT ERROR:", error);
    return { error: error?.message || "Database error occurred while updating resident" };
  }
}
