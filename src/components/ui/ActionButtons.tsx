"use client";

import { Edit, Trash2, MoreVertical, Eye } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

interface ActionButtonsProps {
  onEdit?: () => void;
  editHref?: string;
  onDelete?: () => void;
  onView?: () => void;
  viewHref?: string;
  itemName?: string;
}

export function ActionMenu({ onEdit, editHref, onDelete, onView, viewHref, itemName = "item" }: ActionButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    setIsOpen(false);
    if (onDelete) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `You won't be able to revert this ${itemName}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });
      
      if (result.isConfirmed) {
        onDelete(); // The caller should handle await/router.refresh() if needed
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
          
          {(onView || viewHref) && (
            viewHref ? (
              <Link href={viewHref} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4 text-gray-400" /> View Details
              </Link>
            ) : (
              <button onClick={() => { setIsOpen(false); onView?.(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4 text-gray-400" /> View Details
              </button>
            )
          )}

          {(onEdit || editHref) && (
            editHref ? (
              <Link href={editHref} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4 text-gray-400" /> Edit
              </Link>
            ) : (
              <button onClick={() => { setIsOpen(false); onEdit?.(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Edit className="w-4 h-4 text-gray-400" /> Edit
              </button>
            )
          )}

          {onDelete && (
            <button onClick={handleDelete} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 className="w-4 h-4 text-red-400" /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
