"use client";
import React, { useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import AdvisorProfileModal from "./modals/AdvisorProfileModal";
import AdvisorFormModal from "./modals/AdvisorFormModal";
import SuccessReviewModal from "./modals/SuccessReviewModal";
import Image from "next/image";
import Skeleton from "@/app/components/skeleton/Skeleton";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const MODALS = {
    PROFILE: "profile",
    FORM: "form",
    SUCCESS: "success",
  };
  const { user, loading } = useAuth();
  const [profileFormData, setProfileFormData] = useState({});

  console.log("sdfghjkhgfdsfghjmk,jhgfds", profileFormData);

  const updateStep = (data) => {
    setProfileFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleSubmit = async (payload) => {
    try {
      const res = await fetch("/api/advisor/setprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return false;
      }

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleLogout = async () => {
  try {
    await fetch("/api/auth/admin/logout", {
      method: "POST",
    });

    window.location.href = "/";
  } catch (err) {
    console.error("Logout failed", err);
  }
};

  return (
    <>
      {loading ? (
        <nav className="bg-white border-b border-gray-200 px-4 md:px-6 lg:px-10 xl:px-[120px] shadow-sm">
          <div className="mx-auto flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Skeleton className="w-[90px] h-[40px] rounded-md" />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Home */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>

              {/* Setup Profile */}
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="w-32 h-4 rounded" />
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                {/* Notification */}
                <Skeleton className="w-10 h-10 rounded-full" />

                {/* Avatar */}
                <Skeleton className="w-10 h-10 rounded-full" />

                {/* Logout */}
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center">
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          </div>
        </nav>
      ) : (
        <nav className="bg-white border-b border-gray-200 px-4 md:px-6 lg:px-10 xl:px-[120px] shadow-sm">
          <div className=" mx-auto flex items-center justify-between ">
            {/* Left Side: Logo */}
            <div className="flex items-center space-x-2">
              <Image
                src="/images/yvity-logo.png"
                height={90}
                width={90}
                alt="YVITY logo"
              />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button className="flex items-center px-4 py-1 gap-2 hover:text-black transition text-[14px] leading-[16px] font-medium text-[var(--headings-important-text,#111827)] cursor-pointer">
                <HiOutlineHome size={20} />
                <span className="font-medium">Home</span>
              </button>

              <button
                className="flex items-center gap-2  text-[14px] leading-[16px] px-2 py-1 font-medium text-[var(--headings-important-text,#111827)] cursor-pointer"
                onClick={() => setActiveModal(MODALS.PROFILE)}
              >
                <FiUser size={20} />
                <span className="font-medium">Setup My Profile</span>
              </button>

              {/* Icons & Logout */}
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <div className="relative p-2 bg-gray-50 rounded-full border border-gray-100 cursor-pointer">
                  <IoNotificationsOutline size={22} className="text-gray-600" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-400 rounded-full border border-white"></span>
                </div>

                <div className="w-10 h-10 bg-[#004D4D] text-white flex items-center justify-center rounded-full font-semibold cursor-pointer ring-[2px] ring-[#197272] overflow-hidden">
                  {user?.selfie_url ? (
                    <Image
                      src={user.selfie_url}
                      width={60}
                      height={60}
                      alt="profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span>KM</span>
                  )}
                </div>

                <button className="flex items-center gap-2 text-[14px] leading-[16px] font-medium text-[#EF5555] font-poppins cursor-pointer px-2 py-1" onClick={handleLogout}>
                  <FiLogOut size={20} />
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600"
              >
                {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div className="md:hidden mt-4 space-y-4 pb-4 animate-in slide-in-from-top duration-300">
              <a
                href="#"
                className="flex items-center gap-3 px-2 py-2 text-gray-700 border-b"
              >
                <HiOutlineHome size={20} /> Home
              </a>
              <a
                href="#"
                className="flex items-center gap-3 px-2 py-2 text-gray-700 border-b"
              >
                <FiUser size={20} /> Setup My Profile
              </a>
              <div className="flex items-center justify-between px-2 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#004D4D] text-white flex items-center justify-center rounded-full text-xs">
                    KM
                  </div>
                  <span className="font-medium">Account</span>
                </div>
                <button className="text-red-500 flex items-center gap-1">
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          )}

          {activeModal === MODALS.PROFILE && (
            <AdvisorProfileModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              form={profileFormData}
              onContinue={(selectedRoleId) => {
                updateStep({ roleId: selectedRoleId });
                setActiveModal(MODALS.FORM);
              }}
            />
          )}

          {activeModal === MODALS.FORM && (
            <AdvisorFormModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              form={profileFormData}
              onContinue={async (formdata) => {
                // 1. update parent state FIRST
                setProfileFormData((prev) => {
                  const updated = {
                    ...prev,
                    ...formdata,
                  };

                  // 2. call API with fresh data (not stale closure)
                  handleSubmit(updated).then((success) => {
                    if (success) {
                      setActiveModal(MODALS.SUCCESS);
                    }
                  });

                  return updated;
                });
              }}
              onBack={() => setActiveModal(MODALS.PROFILE)}
            />
          )}

          {activeModal === MODALS.SUCCESS && (
            <SuccessReviewModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
            />
          )}
        </nav>
      )}
    </>
  );
};

export default Header;
