"use client";
import React, { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { FiUser, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { IoNotificationsOutline } from "react-icons/io5";
import AdvisorProfileModal from "./modals/AdvisorProfileModal";
import AdvisorFormModal from "./modals/AdvisorFormModal";
import SuccessReviewModal from "./modals/SuccessReviewModal";
import Image from "next/image";
import Skeleton from "@/app/components/skeleton/Skeleton";
import { useAuth } from "@/context/AuthUserContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import PricingSelectionPlan from "./modals/PricingSelectionPlan";
import PricingModal from "./modals/PricingSelectionPlan";

const Header = () => {
  const router = useRouter();
  const { user, advisor, loading, setLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
   const [isSubmitting, setIsSubmitting] = useState(false); 

  const MODALS = {
    PROFILE: "profile",
    FORM: "form",
    PLAN: "plan",
    SUCCESS: "success",
  };
  const [profileFormData, setProfileFormData] = useState({});

  const updateStep = (data) => {
    setProfileFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleProfileSetupSubmit = async (payload) => {
  try {
    toast.loading("Processing profile setup...", { id: "profile" });
     setIsSubmitting(true);
    let certificate_url = payload.certificate_url;

    // Handle certificate file upload if provided
    if (payload.certificate_file) {
      toast.loading("Uploading IRDAI certificate...", { id: "profile" });

      const file = payload.certificate_file;
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          // Convert file to base64 for production-safe transmission
          const base64Data = reader.result.split(',')[1];
          
          const certRes = await fetch("/api/customer/upload-cert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileBuffer: base64Data,
            }),
          });

          const certData = await certRes.json();

          if (!certRes.ok) {
            toast.error(certData?.error || "Certificate upload failed", {
              id: "profile",
            });
            setIsSubmitting(false);
            return false;
          }

          certificate_url = certData.url;
          
          // Only proceed after successful upload
          await saveProfileData(certificate_url, payload);
        } catch (err) {
          console.error("[CERT_UPLOAD_ERROR]", err.message);
          toast.error("Certificate processing failed", { id: "profile" });
          setIsSubmitting(false);
        }
      };

      reader.onerror = () => {
        toast.error("Failed to read certificate file", { id: "profile" });
      };

        toast.success("Certificate uploaded", { id: "profile" });
      }

      toast.loading("Saving profile details...", { id: "profile" });

      const res = await fetch("/api/customer/setprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          certificate_url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || "Failed to save profile", {
          id: "profile",
        });
        return false;
      }

      toast.success("Profile created successfully", {
        id: "profile",
      });

      return true;
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: "profile" });
      return false;
    }
setIsSubmitting(false);
    return true;
  } catch (err) {
    console.error("[PROFILE_SETUP_ERROR]", err.message);
    toast.error("Unexpected error during profile setup", { id: "profile" });
    setIsSubmitting(false);
    return false;
  }
};

// Extract profile save logic for reusability
const saveProfileData = async (certificateUrl, payload) => {
  toast.loading("Saving profile details...", { id: "profile" });
  const res = await fetch("/api/customer/setprofile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advisor_role_id: payload.advisor_role_id, // Use correct field name
      services: payload.services,
      certificate_url: certificateUrl,
      bio: payload.bio,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data?.message || "Failed to save profile", {
      id: "profile",
    });
    return false;
  }

  toast.success("Profile created successfully 🎉", {
    id: "profile",
  });

  return true;
};

  const [roles, setRoles] = useState([]);

  // Fetch roles from API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("/api/customer/roles");
        const result = await response.json();

        if (result.success && result.data) {
          const formattedRoles = result.data.map((role) => ({
            id: role.id,
            title: role.title,
            desc: role.description,
            iconName: role.icon,
            isAvailable: role.is_available,
          }));
          setRoles(formattedRoles);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      }
    };

    fetchRoles();
  }, []);

  return (
    <>
      {loading ? (
        <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 md:h-[70px] shadow-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-gradient-to-r after:from-[#0D6060] after:to-[#F59E0B]">
          <div className="mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-[90px] h-[40px] rounded-md" />
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="w-16 h-4 rounded" />
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="w-32 h-4 rounded" />
              </div>

              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="w-5 h-5 rounded" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <Skeleton className="w-8 h-8 rounded" />
            </div>
          </div>
        </nav>
      ) : (
        <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-20 md:h-[70px] shadow-sm relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-px after:bg-gradient-to-r after:from-[#0D6060] after:to-[#F59E0B]">
          <div className="h-full mx-auto flex items-center justify-between ">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/Adivisor/Navbar/navlogo.png"
                height={90}
                width={90}
                alt="Navbar logo"
              />
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
              <button className="flex items-center px-4 py-1 gap-2 hover:text-black transition text-[clamp(10px,1vw,14px)] leading-[16px] font-medium text-[var(--headings-important-text,#111827)] cursor-pointer">
                <HiOutlineHome size={20} />
                <span className="font-medium">Home</span>
              </button>

              {user?.roles?.includes("advisor") ? (
                <button
                  className="flex items-center gap-2 bg-[#0A4A4A] hover:bg-[#083c3c] text-white px-4 py-2 rounded-md text-sm font-semibold transition shadow-sm cursor-pointer"
                  onClick={() => router.push("/advisor/dashboard")}
                >
                  {" "}
                  <span className="font-medium">My Dashboard</span>{" "}
                </button>
              ) : (
                <button
                  className="flex items-center gap-2  text-[clamp(10px,1vw,14px)] leading-[16px] px-2 py-1 font-medium text-[#111827] cursor-pointer"
                  onClick={() => setActiveModal(MODALS.PROFILE)}
                >
                  <FiUser size={20} />
                  <span className="font-medium">Setup My Profile</span>
                </button>
              )}

              <div className="flex items-center gap-4 pl-4">
                <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6">
                  <div className="relative shrink-0 h-9.75 w-9.75 p-2 bg-gray-50 rounded-full border border-gray-100 cursor-pointer ring-[1px] ring-[#E4E2DB]">
                    <IoNotificationsOutline
                      size={22}
                      className="text-gray-600"
                    />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-400 rounded-full border border-white"></span>
                  </div>

                  <div className="relative shrink-0 h-[38px] w-[38px] p-2 bg-[#004D4D] text-white flex items-center justify-center rounded-full font-semibold cursor-pointer ring-[2px] ring-[#197272] overflow-hidden">
                    {user?.selfie_url ? (
                      <Image
                        src={user.selfie_url}
                        fill
                        alt="profile"
                        className="object-cover"
                      />
                    ) : (
                      <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
                    )}
                  </div>
                </div>

                <button className="flex items-center gap-2 text-[clamp(10px,1vw,14px)] leading-[16px] font-medium text-[#EF5555] font-poppins cursor-pointer px-2 py-1">
                  <FiLogOut size={20} />
                  Logout
                </button>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600"
              >
                {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                  opacity: { duration: 0.2 },
                }}
                className="md:hidden overflow-hidden"
              >
                <div className="mt-4 space-y-2 pb-4 border-t pt-4">
                  <a className="flex items-center gap-3 px-2 py-2 text-gray-700 border-b">
                    <HiOutlineHome size={20} /> Home
                  </a>

                  <a className="flex items-center gap-3 px-2 py-2 text-gray-700 border-b">
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
              </motion.div>
            )}
          </AnimatePresence>

          {activeModal === MODALS.PROFILE && (
            <AdvisorProfileModal
              isOpen={true}
              onClose={() => !isSubmitting && setActiveModal(null)}
              form={profileFormData}
              onContinue={(selectedRoleId) => {
                updateStep({ advisor_role_id: selectedRoleId });
                setActiveModal(MODALS.FORM);
              }}
              roles={roles}
            />
          )}

          {activeModal === MODALS.FORM && (
            <AdvisorFormModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              form={profileFormData}
              onContinue={async (formdata) => {
                setProfileFormData((prev) => {
                  const updated = {
                    ...prev,
                    ...formdata,
                  };
                  handleProfileSetupSubmit(updated).then((success) => {
                    if (success) {
                      setActiveModal(MODALS.PLAN);
                    }
                  });
                  return updated;
                });
              }}
              onBack={() => setActiveModal(MODALS.PROFILE)}
            />
          )}

          {activeModal === MODALS.PLAN && (
            <PricingModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
              form={profileFormData}
              onContinue={async (formdata) => {
                setProfileFormData((prev) => {
                  const updated = {
                    ...prev,
                    ...formdata,
                  };

                  handleSubmit(updated).then((success) => {
                    if (success) {
                      setActiveModal(MODALS.SUCCESS);
                    }
                  });

                  return updated;
                });
              }}
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
