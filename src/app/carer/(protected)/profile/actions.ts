"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

import fs from "fs";
import path from "path";

export async function updateProfile(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  let image = formData.get("image") as string | null;

  if (!name || !email) {
    throw new Error("Name and Email are required");
  }

  // Check if email is already taken by someone else
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser && existingUser.id !== userId) {
    throw new Error("Email is already in use by another account");
  }

  const dataToUpdate: any = { name, email };
  
  if (image && image.startsWith("data:image/")) {
    try {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const extension = image.split(";")[0].split("/")[1] || "png";
      const fileName = `profile-${userId}-${Date.now()}.${extension}`;
      
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      
      // We return the API route path for client update
      image = `/api/uploads/${fileName}`;
      dataToUpdate.image = image;
    } catch (e) {
      console.error("Failed to save image", e);
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
  });

  revalidatePath("/carer/profile");
  
  return { success: true, imagePath: image };
}

export async function changePassword(userId: string, formData: FormData) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    throw new Error("Both current and new passwords are required");
  }

  if (newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Incorrect current password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  revalidatePath("/carer/profile");
}
