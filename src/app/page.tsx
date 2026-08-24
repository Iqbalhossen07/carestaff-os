import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.userType === "WORKER") {
    redirect("/carer");
  } else if (session.user.userType === "CLIENT") {
    redirect("/family");
  } else {
    redirect("/dashboard");
  }
}
