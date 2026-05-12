"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import PermissionsChecklist from "@/components/admin/roles/PermissionsChecklist";
import { DEFAULT_ADMIN_PERMISSIONS } from "@/lib/admin/permissions";
import { useCreateAdminUser } from "@/hooks/TanstankQuery/useAdminUsers";
import { IoClose } from "react-icons/io5";

function initialFormState() {
  return {
    name: "",
    phone_number: "",
    profile_image_url: null,
    permissions: { ...DEFAULT_ADMIN_PERMISSIONS },
  };
}

async function uploadProfileImage(file) {
  if (!file) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose a valid image file");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Please upload an image under 5MB");
  }

  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("kind", "profile_image");

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json?.error || "Profile image upload failed");
  }

  return json.url || null;
}

function getInitials(name) {
  const initials = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  return initials || "YITY";
}

export default function CreateAdminModal({ onClose }) {
  const [form, setForm] = useState(initialFormState);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const createAdminUser = useCreateAdminUser();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const profileImageUrl = profileImageFile
        ? await uploadProfileImage(profileImageFile)
        : form.profile_image_url;

      await createAdminUser.mutateAsync({
        ...form,
        profile_image_url: profileImageUrl,
      });
      toast.success("Admin user created successfully");
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to create admin user");
    }
  };

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Admin User</h2>
            <p className="mt-1 text-sm text-gray-500">
              Add a new admin and choose exactly what they can access.
            </p>
          </div>

          <button
            type="button"
            
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 shrink-0 hover:bg-gray-100 cursor-pointer"
          >
            <IoClose size={24}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div className="rounded-2xl border border-gray-100 bg-[#F8F6F1] p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#F59E0B] ring-2 ring-[#FEC564]">
                {profilePreviewUrl ? (
                  <Image
                    src={profilePreviewUrl}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
                    {getInitials(form.name)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setProfileImageFile(file);
                    setProfilePreviewUrl(file ? URL.createObjectURL(file) : "");
                  }}
                  className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#0A4A4A] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Upload a square image for the best fit. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    name: event.target.value,
                  }))
                }
                placeholder="Enter admin name"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                value={form.phone_number}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    phone_number: event.target.value,
                  }))
                }
                placeholder="9876543210 or +919876543210"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-[#0A4A4A]"
              />
              <p className="mt-2 text-xs text-gray-500">
                The login flow currently supports Indian admin numbers.
              </p>
            </div>
          </div>

          <PermissionsChecklist
            permissions={form.permissions}
            setPermissions={(valueOrUpdater) =>
              setForm((currentForm) => ({
                ...currentForm,
                permissions:
                  typeof valueOrUpdater === "function"
                    ? valueOrUpdater(currentForm.permissions)
                    : valueOrUpdater,
              }))
            }
          />

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600"
          >
            Cancel
          </button>
            <button
              type="submit"
              disabled={createAdminUser.isPending}
              className="cursor-pointer rounded-xl bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
            >
              {createAdminUser.isPending ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
