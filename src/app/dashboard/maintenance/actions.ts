"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTicket(formData: FormData, careHomeId: string, reportedBy: string) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  if (!title || !description) {
    throw new Error("Missing fields");
  }

  await prisma.maintenanceTicket.create({
    data: {
      careHomeId,
      title,
      description,
      priority,
      reportedBy,
    },
  });

  revalidatePath("/dashboard/maintenance");
}

export async function updateTicketStatus(ticketId: string, status: string) {
  await prisma.maintenanceTicket.update({
    where: { id: ticketId },
    data: { status },
  });

  revalidatePath("/dashboard/maintenance");
}
