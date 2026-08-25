"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mail";

// Generate a random 8-character password
function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

export async function createStaffMember(formData: FormData, careHomeId: string) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;

  if (!name || !email) {
    throw new Error("Name and Email are required");
  }

  // Generate a random password
  const rawPassword = generatePassword();
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      userType: "WORKER",
      careHomeId,
      roleId: roleId || null,
    },
  });

  // 1. Send Email to the new Staff Member
  const loginUrl = `${process.env.NEXTAUTH_URL || "https://carestaff.iqbalhossen.xyz"}/carer/login`;
  
  await sendEmail({
    to: email,
    subject: "Welcome to CareStaff OS - Your Account Details",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563EB;">Welcome to CareStaff OS, ${name}!</h2>
        <p>Your staff account has been successfully created by the Admin.</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Login Portal:</strong> <a href="${loginUrl}">${loginUrl}</a></p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${rawPassword}</p>
        </div>
        <p><em>Please log in and change your password as soon as possible.</em></p>
      </div>
    `,
  });

  // 2. Send Notification Email to the Admin
  const adminEmail = process.env.SMTP_USER || "admin@sunrisecare.com";
  await sendEmail({
    to: adminEmail,
    subject: "New Staff Member Added - CareStaff OS",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #059669;">New Staff Successfully Added</h2>
        <p>A new staff member has been added to the Care Home portal.</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
        </ul>
        <p>An automated email with login credentials has been sent to them.</p>
      </div>
    `,
  });

  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard"); 
}

export async function deleteStaff(id: string) {
  await prisma.user.delete({
    where: { id },
  });
  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard");
}

export async function updateStaff(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const roleId = formData.get("roleId") as string;

  if (!name || !email) {
    throw new Error("Name and Email are required");
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      roleId: roleId || null,
    },
  });

  // Notify Staff about the update
  await sendEmail({
    to: email,
    subject: "Your Account Details Updated - CareStaff OS",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #2563EB;">Hello ${name},</h2>
        <p>Your account details or role permissions have just been updated by the Admin.</p>
        <p>If you are currently logged in, please refresh your portal to see the latest changes.</p>
      </div>
    `,
  });

  revalidatePath("/dashboard/staff");
  revalidatePath(`/dashboard/staff/${id}`);
}
