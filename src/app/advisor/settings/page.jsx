import AccountSettings from "@/components/features/advisor/settings/account-settings";
import DangerZone from "@/components/features/advisor/settings/danger-zone";
import NotificationPreferences from "@/components/features/advisor/settings/notification-preferences";
import PageHeader from "@/components/features/advisor/settings/page-header";
import PrivacyPreferences from "@/components/features/advisor/settings/privacy-preferences";


export default function SettingsPage() {
  return (
    <div className="bg-[#F8F6F1] min-h-screen w-full flex flex-col">
      {/* <PageHeader /> */}
      
      <div className="p-4 md:p-6 lg:p-10 xl:px-15 space-y-6 mx-auto w-full pb-12">
        <AccountSettings />
        <NotificationPreferences />
        <PrivacyPreferences />
        <DangerZone />
      </div>
    </div>
  );
}