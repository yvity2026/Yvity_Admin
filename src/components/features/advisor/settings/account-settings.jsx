"use client";

import { useState } from "react";
import { SettingsCard, ActionRow } from "./settings-ui";
import { MobileModal, EmailModal, PasswordModal } from "./settings-modals";

export default function AccountSettings() {
  const [activeModal, setActiveModal] = useState(null);

  return (
    <>
      <SettingsCard title="Account Settings">
        <ActionRow 
          icon="📱" 
          iconBg="bg-[#E0F2FE]" 
          title="Mobile Number" 
          subtitle="+91 9876543210 • Verified" 
          actionText="Change" 
          onClick={() => setActiveModal('mobile')}
        />
        <ActionRow 
          icon="✉️" 
          iconBg="bg-[#E0F2FE]" 
          title="Email ID" 
          subtitle="[email protected]" 
          actionText="Change" 
          onClick={() => setActiveModal('email')}
        />
        <ActionRow 
          icon="🔒" 
          iconBg="bg-[#FEF3C7]" 
          title="Password" 
          subtitle="Last changed 3 months ago" 
          actionText="Change" 
          onClick={() => setActiveModal('password')}
        />
      </SettingsCard>

      {/* Modals */}
      <MobileModal 
        isOpen={activeModal === 'mobile'} 
        onClose={() => setActiveModal(null)} 
      />
      <EmailModal 
        isOpen={activeModal === 'email'} 
        onClose={() => setActiveModal(null)} 
      />
      <PasswordModal 
        isOpen={activeModal === 'password'} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  );
}