import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  
  const careHome = await prisma.careHome.findUnique({
    where: { id: session?.user?.careHomeId }
  });

  if (!careHome) {
    return (
      <div className="p-8 text-center text-gray-500">
        Care Home configuration not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
          <p className="text-gray-500 mt-1">Manage your care home profile and system preferences.</p>
        </div>
      </div>
      
      <SettingsForm careHome={careHome} />
    </div>
  );
}
