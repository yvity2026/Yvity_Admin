import Header from '@/components/features/user/landing/Header'
import React from 'react'

const page = () => {
  return (
    <>
    <Header />
    <LandingPopup />
    <AdvisorSearchFilter />
    <SavedProfiles/>
    </>
  )
}

export default page