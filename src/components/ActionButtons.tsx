"use client";

import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  viewUrl?: string;
  editUrl?: string;
  deleteAction?: () => Promise<void>;
}

export function ActionButtons({ viewUrl, editUrl, deleteAction }: ActionButtonsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteAction) return;
    
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (result.isConfirmed) {
      await deleteAction();
      Swal.fire('Deleted!', 'The record has been deleted.', 'success');
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {viewUrl && (
        <Link 
          href={viewUrl} 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Link>
      )}
      {editUrl && (
        <Link 
          href={editUrl} 
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
        >
          <Edit className="w-3.5 h-3.5" /> Edit
        </Link>
      )}
      {deleteAction && (
        <button 
          onClick={handleDelete}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      )}
    </div>
  );
}
