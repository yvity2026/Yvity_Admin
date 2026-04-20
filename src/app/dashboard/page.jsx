import Header from '@/components/features/user/landing/Header'
import AdvisorSearchFilter from '@/components/features/user/landing/HeroSection'
import LandingPopup from '@/components/features/user/landing/LandingPopup'
import SavedProfiles from '@/components/features/user/landing/SavedProfiles'
import React from 'react'

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