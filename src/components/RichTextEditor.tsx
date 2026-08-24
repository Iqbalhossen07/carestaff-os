"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />
});

export function RichTextEditor({ name, placeholder }: { name: string, placeholder?: string }) {
  const [content, setContent] = useState("");

  return (
    <div className="bg-white rounded-lg relative">
      <input type="hidden" name={name} value={content} />
      <ReactQuill 
        theme="snow" 
        value={content} 
        onChange={setContent} 
        placeholder={placeholder}
        className="h-32 mb-10" // Leave room for the editor box
      />
    </div>
  );
}
