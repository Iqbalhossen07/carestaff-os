"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/mail";

export async function reportIncident(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const severity = formData.get("severity") as string;

  if (!title || !description || !severity) {
    throw new Error("All fields are required");
  }

  const incident = await prisma.incidentReport.create({
    data: {
      title,
      description,
      severity,
      careHomeId: session.user.careHomeId as string,
      reportedById: session.user.id
    }
  });

  // Try to notify the Admin
  try {
    const adminEmail = process.env.SMTP_USER; // Or query the Super Admin email from DB
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `[🚨 Incident Alert - ${severity}] ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
            <h2 style="color: #dc2626;">New Incident Reported</h2>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Severity:</strong> <span style="background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 4px;">${severity}</span></p>
            <p><strong>Reported By:</strong> ${session.user.name}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h3>Description:</h3>
            <p style="background: #f9fafb; padding: 15px; border-radius: 6px;">${description}</p>
            <br/>
            <p style="font-size: 12px; color: #6b7280;">This is an automated message from CareStaff OS.</p>
          </div>
        `
      });
    }
  } catch (err) {
    console.error("Failed to send incident email notification:", err);
    // don't throw error to user if email fails, just log it.
  }

  revalidatePath("/carer/incidents");
  return { success: true };
}
