"use client";

import { SettingsCard, ToggleRow } from "./settings-ui";

const preferencesData = [
  { id: 'notif-1', icon: '💬', iconBg: 'bg-[#E0F2FE]', title: 'New Testimonial', subtitle: 'When a client submits a review', defaultActive: true },
  { id: 'notif-2', icon: '👍', iconBg: 'bg-[#FEF3C7]', title: 'New Recommendation', subtitle: 'When someone recommends you', defaultActive: true },
  { id: 'notif-3', icon: '👁️', iconBg: 'bg-[#F1F5F9]', title: 'Profile Views', subtitle: 'Weekly summary of profile visits', defaultActive: true },
  { id: 'notif-4', icon: '🎂', iconBg: 'bg-[#FFEDD5]', title: 'Birthday Selfie Reminder', subtitle: 'Annual reminder to update your photo', defaultActive: true },
  { id: 'notif-5', icon: '💳', iconBg: 'bg-[#E0F2FE]', title: 'Subscription Reminder', subtitle: '30 days before plan expiry', defaultActive: true },
  { id: 'notif-6', icon: '📢', iconBg: 'bg-[#CCFBF1]', title: 'YVITY Announcements', subtitle: 'New features and updates', defaultActive: true },
];

export default function NotificationPreferences() {
  return (
    <SettingsCard title="Notification Preferences">
      {preferencesData.map((pref) => (
        <ToggleRow 
          key={pref.id}
          icon={pref.icon}
          iconBg={pref.iconBg}
          title={pref.title}
          subtitle={pref.subtitle}
          isActive={pref.defaultActive}
          onToggle={() => console.log(`Toggle ${pref.id}`)}
        />
      ))}
    </SettingsCard>
  );
}
