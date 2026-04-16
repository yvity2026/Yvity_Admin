"use client";

import { SettingsCard, ToggleRow } from "./settings-ui";

export default function PrivacyPreferences() {
  return (
    <SettingsCard title="Notification Preferences"> {/* Kept title exact to design, consider changing to Privacy/Visibility */}
      <ToggleRow 
        icon="🔍" 
        iconBg="bg-[#FEF3C7]" 
        title="Directory Listing" 
        subtitle="Appear in YVITY advisor search results" 
        isActive={true}
        onToggle={() => {}}
      />
      <ToggleRow 
        icon="📞" 
        iconBg="bg-[#E0F2FE]" 
        title="Show Contact Details" 
        subtitle="Mobile and email visible on public profile" 
        isActive={true}
        onToggle={() => {}}
      />
    </SettingsCard>
  );
}
