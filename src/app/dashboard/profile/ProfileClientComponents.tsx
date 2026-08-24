"use client";

import { useState, useRef } from "react";
import { updateProfile, changePassword } from "./actions";
import { Camera, User } from "lucide-react";
import { useSession } from "next-auth/react";

export function ProfileForm({ user }: { user: any }) {
  const { update } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(user.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setMessage("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    if (preview) {
      formData.set("image", preview);
    }
    
    try {
      await updateProfile(user.id, formData);
      await update({ name: formData.get("name"), image: preview }); // Update NextAuth session
      setMessage("Profile updated successfully.");
    } catch (error: any) {
      setMessage(error.message || "Failed to update profile.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 text-sm rounded ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <p className="text-xs text-gray-500 mt-2">Max size: 2MB. Format: JPG, PNG.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input 
          type="text" 
          name="name" 
          defaultValue={user.name} 
          required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          type="email" 
          name="email" 
          defaultValue={user.email} 
          required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-70 transition-colors"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}

export function PasswordForm({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await changePassword(userId, formData);
      setMessage("Password updated successfully.");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      setMessage(error.message || "Failed to update password.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 text-sm rounded ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
        <input 
          type="password" 
          name="currentPassword" 
          required 
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
        <input 
          type="password" 
          name="newPassword" 
          required 
          minLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
        <input 
          type="password" 
          name="confirmPassword" 
          required 
          minLength={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading} 
        className="w-full mt-2 bg-gray-900 hover:bg-black text-white font-medium py-2 rounded-lg disabled:opacity-70 transition-colors"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
