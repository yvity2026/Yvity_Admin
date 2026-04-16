import { SettingsCard, ActionRow } from "./settings-ui";

export default function AccountSettings() {
  return (
    <SettingsCard title="Account Settings">
      <ActionRow 
        icon="📱" 
        iconBg="bg-[#E0F2FE]" 
        title="Mobile Number" 
        subtitle="+91 9876543210 • Verified" 
        actionText="Change" 
      />
      <ActionRow 
        icon="✉️" 
        iconBg="bg-[#E0F2FE]" 
        title="Email ID" 
        subtitle="[email protected]" 
        actionText="Change" 
      />
      <ActionRow 
        icon="🔒" 
        iconBg="bg-[#FEF3C7]" 
        title="Password" 
        subtitle="Last changed 3 months ago" 
        actionText="Change" 
      />
    </SettingsCard>
  );
}