import DashboardLayoutClient from "@/components/DashboardLayoutClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Basic authorization: Only Super Admin and Admin can access Panel A
  if (session.user.userType !== "SUPER_ADMIN" && session.user.userType !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to view the Admin Panel.</p>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, userType: true }
  });

  return (
    <DashboardLayoutClient dbUser={user}>
      {children}
    </DashboardLayoutClient>
  );
}
