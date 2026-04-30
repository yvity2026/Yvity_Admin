"use client"
import { useAuth } from "@/context/AuthUserContext";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { BsHandbagFill } from "react-icons/bs";

const LandingPopup = () => {
  const { advisor, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

   if (loading) return null;

  if (advisor?.id) return null;

  return (
    <>
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full bg-[#F2F0E4] border-y border-[#D1D5DB] px-4 py-[10px] lg:px-8 xl:px-12 2xl:px-20 sm:py-2 relative overflow-hidden"
            >
              <div className="mx-auto flex flex-col sm:flex-row items-center gap-2 md:justify-between">
                {/* Content */}
                <div className="flex items-center gap-[10px] text-center sm:text-left">
                  <div className="bg-orange-400 p-1.5 rounded-md shrink-0">
                    <BsHandbagFill
                      size={16}
                      className="text-white fill-current"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:gap-2 shrink-0">
                    <span className="text-[clamp(12px,1.5vw,16px)] font-semibold text-[#0A4A4A] font-poppins sm:whitespace-nowrap">
                      Offer your services on YVITY?
                    </span>
                    <span className="text-[clamp(10px,1vw,14px)] leading-[16px] font-normal text-[#6B7280] font-poppins">
                      Complete your profile setup — takes 3 minutes.
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
                  <button
                    className="bg-[#104D4D] hover:bg-[#0D3D3D] py-2 md:py-[14px] md:px-[40px] px-6 rounded-full transition-all text-[clamp(10px,1vw,14px)] font-bold text-[#F59E0B] font-poppins cursor-pointer"
                    onClick={() => console.log("Navigating to setup...")}
                  >
                    Setup Now
                  </button>

                  <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 sm:static text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                    aria-label="Close banner"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
};


export default LandingPopup;