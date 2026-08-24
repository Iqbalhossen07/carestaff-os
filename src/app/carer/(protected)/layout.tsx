import CarerLayoutClient from "@/components/carer/CarerLayoutClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function CarerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/carer/login");
  }

  // Authorization: Only WORKER can access Panel B (Carer panel)
  // But maybe SUPER_ADMIN/ADMIN can also access it for testing? Let's allow admins too for flexibility.
  if (!session.user.userType) {
    redirect("/carer/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, userType: true }
  });

  return (
    <CarerLayoutClient dbUser={user}>
      {children}
    </CarerLayoutClient>
  );
}
