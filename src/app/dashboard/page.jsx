import Header from '@/components/features/user/landing/Header'
import AdvisorSearchFilter from '@/components/features/user/landing/HeroSection'
import LandingPopup from '@/components/features/user/landing/LandingPopup'
import SavedProfiles from '@/components/features/user/landing/SavedProfiles'
import React from 'react'

export const metadata = {
  title: "YVITY Dashboard",
  description: "Overview of your dashboard",
};

const page = () => {
  return (
    <>
    <Header />
    <LandingPopup />
    <AdvisorSearchFilter />
    <SavedProfiles />
    </>
  )
}

export default page