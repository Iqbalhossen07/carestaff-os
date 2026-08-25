import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import EditResidentClient from "./EditResidentClient";

export default async function EditResidentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const resident = await prisma.resident.findUnique({
    where: { id },
  });

  if (!resident) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/residents" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Directory
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Resident</h1>
        <EditResidentClient residentId={id} resident={resident} />
      </div>
    </div>
  );
}
