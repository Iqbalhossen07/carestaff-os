"use client";

import { useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon } from "lucide-react";

export function RichTextEditor({ name, placeholder }: { name: string, placeholder?: string }) {
  const [content, setContent] = useState("");

  return (
    <div className="bg-white rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-1">
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Bold className="w-4 h-4" /></button>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Italic className="w-4 h-4" /></button>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><Underline className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-gray-300 mx-1 self-center"></div>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><List className="w-4 h-4" /></button>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><ListOrdered className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-gray-300 mx-1 self-center"></div>
        <button type="button" className="p-1.5 hover:bg-gray-200 rounded text-gray-600"><LinkIcon className="w-4 h-4" /></button>
      </div>
      <textarea 
        name={name} 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full px-4 py-3 outline-none resize-y min-h-[120px] text-gray-900"
      />
    </div>
  );
}
