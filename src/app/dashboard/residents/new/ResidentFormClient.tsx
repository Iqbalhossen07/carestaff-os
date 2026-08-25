"use client";

import { useState } from "react";
import { createResident } from "../actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Upload, X } from "lucide-react";
import Image from "next/image";

export default function ResidentFormClient({ careHomeId }: { careHomeId: string }) {
  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const router = useRouter();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let photoUrl = "";
    if (photoFile) {
      try {
        const uploadData = new FormData();
        uploadData.append("file", photoFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        if (uploadRes.ok) {
          const resJson = await uploadRes.json();
          photoUrl = resJson.url;
        } else {
          throw new Error("Failed to upload photo");
        }
      } catch (err: any) {
        Swal.fire("Error", "Could not upload the photo.", "error");
        setLoading(false);
        return;
      }
    }

    const data = {
      careHomeId,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      nhsNumber: formData.get("nhsNumber") as string,
      roomNumber: formData.get("roomNumber") as string,
      medicalHistory: formData.get("medicalHistory") as string,
      allergies: formData.get("allergies") as string,
      dietaryReqs: formData.get("dietaryReqs") as string,
      emergencyContactName: formData.get("emergencyContactName") as string,
      emergencyContactPhone: formData.get("emergencyContactPhone") as string,
      photo: photoUrl || undefined,
    };

    try {
      const res = await createResident(data);
      if (res.error) {
        throw new Error(res.error);
      }
      Swal.fire('Success', 'Resident added successfully', 'success');
      router.push("/dashboard/residents");
      router.refresh();
    } catch (error: any) {
      Swal.fire('Error', error.message || "Failed to save resident", 'error');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Resident Photo (Optional)</label>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              <>
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button type="button" onClick={removePhoto} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <Upload className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              id="photo-upload" 
              className="hidden" 
            />
            <label 
              htmlFor="photo-upload" 
              className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Choose Photo
            </label>
            <p className="text-xs text-gray-500 mt-2">JPG, PNG or WEBP. Max 2MB.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            placeholder="e.g. John"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input
            type="text"
            name="lastName"
            placeholder="e.g. Doe"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
          <input
            type="date"
            name="dateOfBirth"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NHS Number</label>
          <input
            type="text"
            name="nhsNumber"
            placeholder="e.g. 123 456 7890"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
          <input
            type="text"
            name="roomNumber"
            placeholder="e.g. 101-A"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Requirements</label>
          <input
            type="text"
            name="dietaryReqs"
            placeholder="e.g. Vegetarian, Diabetic"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
        <textarea
          name="allergies"
          rows={2}
          placeholder="e.g. Penicillin, Peanuts"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 resize-none"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Medical History & Care Plan</label>
        <textarea
          name="medicalHistory"
          rows={3}
          placeholder="Provide a brief summary of medical history and care instructions..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 resize-none"
        ></textarea>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              placeholder="e.g. Jane Doe (Daughter)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="text"
              name="emergencyContactPhone"
              placeholder="e.g. +44 7700 900000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Link 
          href="/dashboard/residents"
          className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Resident"}
        </button>
      </div>
    </form>
  );
}
