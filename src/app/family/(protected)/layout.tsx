import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import FamilyLayoutClient from "@/components/family/FamilyLayoutClient";

export default async function FamilyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/family/login");
  }

  // Only CLIENT or SUPER_ADMIN/ADMIN can view this
  if (session.user.userType !== "CLIENT" && session.user.userType !== "SUPER_ADMIN" && session.user.userType !== "ADMIN") {
    redirect("/family/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) {
    redirect("/family/login");
  }

  return (
    <FamilyLayoutClient dbUser={user}>
      {children}
    </FamilyLayoutClient>
  );
}
