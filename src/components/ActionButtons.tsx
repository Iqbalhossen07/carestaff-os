import { Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

interface ActionButtonsProps {
  viewUrl?: string;
  editUrl?: string;
  onDelete?: () => void;
}

export function ActionButtons({ viewUrl, editUrl, onDelete }: ActionButtonsProps) {
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
      {onDelete && (
        <button 
          onClick={onDelete}
          type="button"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      )}
    </div>
  );
}
