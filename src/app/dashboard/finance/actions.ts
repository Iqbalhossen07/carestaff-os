"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInvoice(formData: FormData, careHomeId: string) {
  const residentId = formData.get("residentId") as string;
  const description = formData.get("description") as string;
  const amountStr = formData.get("amount") as string;
  const dueDateStr = formData.get("dueDate") as string;

  if (!residentId || !description || !amountStr || !dueDateStr) {
    throw new Error("Missing fields");
  }

  await prisma.invoice.create({
    data: {
      careHomeId,
      residentId,
      description,
      amount: parseFloat(amountStr),
      dueDate: new Date(dueDateStr),
      status: "UNPAID",
    }
  });

  revalidatePath("/dashboard/finance");
}

export async function markInvoicePaid(invoiceId: string) {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID" }
  });

  revalidatePath("/dashboard/finance");
}
