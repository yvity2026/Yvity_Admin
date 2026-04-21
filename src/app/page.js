"use client"
import Image from "next/image";
import Sidebar from "./components/layout/Sidebar";
import { redirect } from "next/navigation";
import Header from "@/components/features/user/landing/Header";
import LandingPopup from "@/components/features/user/landing/LandingPopup";
import HeroSection from "@/components/features/user/landing/HeroSection";
import SavedProfiles from "@/components/features/user/landing/SavedProfiles";
import AdvisorSearchFilter from "@/components/features/user/landing/HeroSection";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  // return (
  //   <>
    
  //   </>
  // );
  router.push("/auth/init");

}
