"use client"
import Image from "next/image";
import Sidebar from "./components/layout/Sidebar";
import { redirect } from "next/navigation";
import Header from "@/components/features/user/landing/Header";
import LandingPopup from "@/components/features/user/landing/LandingPopup";
import HeroSection from "@/components/features/user/landing/HeroSection";
import SavedProfiles from "@/components/features/user/landing/SavedProfiles";
import AdvisorSearchFilter from "@/components/features/user/landing/HeroSection";

export default function Home() {
  return (
    <>
    <Header />
    <LandingPopup />
    <AdvisorSearchFilter />
    <SavedProfiles/>
    </>
  );
  // redirect("/advisor/dashboard");

}
