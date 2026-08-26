const fs = require('fs');

const content = `"use server"

import prisma from "@/lib/prisma";

export async function getResidentMedications(residentId: string) {
  try {
    const meds = await prisma.medication.findMany({
      where: { 
        residentId,
        status: "ACTIVE"
      },
      orderBy: { createdAt: 'desc' }
    });

    // Convert dates to string to fix Next.js Client Component serialization bug
    const serializedMeds = meds.map(med => ({
      ...med,
      startDate: med.startDate.toISOString(),
      endDate: med.endDate ? med.endDate.toISOString() : null,
      createdAt: med.createdAt.toISOString(),
      updatedAt: med.updatedAt.toISOString(),
    }));

    return { meds: serializedMeds };
  } catch (error: any) {
    return { error: error.message };
  }
}
`;
fs.writeFileSync('src/app/dashboard/emar/new/actions.ts', content);
