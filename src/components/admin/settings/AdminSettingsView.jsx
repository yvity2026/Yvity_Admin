"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DEFAULT_PLATFORM_SETTINGS, SETTINGS_SECTIONS } from "@/lib/admin/settings/defaultSettings";
import { useAdmin } from "@/context/AuthAdminContext";
import { hasPermission } from "@/lib/admin/permissions";
import { usePlatformSettings, useSettingsActions } from "@/hooks/TanstankQuery/useSettings";
import {
  AdminConfirmDialog,
  AdminErrorState,
  AdminField,
  AdminInput,
  AdminPageHero,
  AdminPageShell,
  AdminPageSkeleton,
  AdminPanel,
  AdminTabBar,
  AdminSelect,
  AdminTextarea,
  AdminToggle,
  useConfirmDialog,
} from "@/components/admin/ui";

function SectionHeader({ emoji, title }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A928D]">
        {emoji} {title}
      </p>
      <h2 className="font-cormorant text-[24px] font-bold text-[#0A4A4A]">{title}</h2>
    </div>
  );
}

export default function AdminSettingsView() {
  const { admin, loading: adminLoading } = useAdmin();
  const canEdit = hasPermission(admin, "settings");
  const { data, isLoading, isError, error } = usePlatformSettings();
  const { saveSettings, runAction, isProcessing } = useSettingsActions();
  const { confirm, dialogProps } = useConfirmDialog();

  const [section, setSection] = useState("platform");
  const [form, setForm] = useState(DEFAULT_PLATFORM_SETTINGS);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (data?.data) {
      setForm(data.data);
      setDirty(false);
    }
  }, [data]);

  const setSectionValue = (sectionKey, key, value) => {
    setForm((current) => ({
      ...current,
      [sectionKey]: { ...current[sectionKey], [key]: value },
    }));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!canEdit) return;
    try {
      await saveSettings.mutateAsync(form);
      toast.success("Settings saved");
      setDirty(false);
    } catch (err) {
      toast.error(err.message || "Failed to save settings");
    }
  };

  const handleReset = async () => {
    const ok = await confirm({
      title: "Reset settings",
      message: "Reset all settings to defaults? This cannot be undone.",
      confirmLabel: "Reset",
      variant: "danger",
    });
    if (!ok) return;
    try {
      const result = await runAction.mutateAsync({ action: "reset" });
      setForm(result.data);
      toast.success("Settings reset");
      setDirty(false);
    } catch (err) {
      toast.error(err.message || "Reset failed");
    }
  };

  const handleAction = async (action, extra = {}) => {
    try {
      const result = await runAction.mutateAsync({ action, ...extra });
      toast.success(result.message || "Done");
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  if (adminLoading || isLoading) {
    return <AdminPageSkeleton layout="settings" />;
  }

  if (!canEdit) {
    return (
      <AdminPageShell>
        <AdminPanel>
          <h1 className="font-cormorant text-2xl font-bold text-[#0A4A4A]">Access restricted</h1>
          <p className="mt-2 text-sm text-[#5C7571]">You do not have permission to manage settings.</p>
        </AdminPanel>
      </AdminPageShell>
    );
  }

  if (isError) {
    return (
      <AdminErrorState
        title="Could not load settings"
        message={error?.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const s = form;

  const sectionContent = {
    platform: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Platform name">
          <AdminInput value={s.platform.name} onChange={(e) => setSectionValue("platform", "name", e.target.value)} />
        </AdminField>
        <AdminField label="Platform tagline">
          <AdminInput value={s.platform.tagline} onChange={(e) => setSectionValue("platform", "tagline", e.target.value)} />
        </AdminField>
        <AdminField label="Platform description" hint="Shown on marketing pages and emails.">
          <AdminTextarea rows={3} value={s.platform.description} onChange={(e) => setSectionValue("platform", "description", e.target.value)} />
        </AdminField>
        <AdminField label="Platform logo URL">
          <AdminInput value={s.platform.logoUrl} onChange={(e) => setSectionValue("platform", "logoUrl", e.target.value)} />
        </AdminField>
        <AdminField label="Favicon URL">
          <AdminInput value={s.platform.faviconUrl} onChange={(e) => setSectionValue("platform", "faviconUrl", e.target.value)} />
        </AdminField>
        <AdminField label="Platform status">
          <AdminSelect value={s.platform.status} onChange={(e) => setSectionValue("platform", "status", e.target.value)}>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance mode</option>
          </AdminSelect>
        </AdminField>
      </div>
    ),
    branding: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Primary color">
          <AdminInput type="color" value={s.branding.primaryColor} onChange={(e) => setSectionValue("branding", "primaryColor", e.target.value)} />
        </AdminField>
        <AdminField label="Secondary color">
          <AdminInput type="color" value={s.branding.secondaryColor} onChange={(e) => setSectionValue("branding", "secondaryColor", e.target.value)} />
        </AdminField>
        <AdminField label="Button style">
          <AdminSelect value={s.branding.buttonStyle} onChange={(e) => setSectionValue("branding", "buttonStyle", e.target.value)}>
            <option value="rounded">Rounded</option>
            <option value="pill">Pill</option>
            <option value="square">Square</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="Default theme">
          <AdminSelect value={s.branding.defaultTheme} onChange={(e) => setSectionValue("branding", "defaultTheme", e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </AdminSelect>
        </AdminField>
        <AdminToggle label="Login page branding" checked={s.branding.loginBranding} onChange={(v) => setSectionValue("branding", "loginBranding", v)} />
        <AdminToggle label="Email branding" checked={s.branding.emailBranding} onChange={(v) => setSectionValue("branding", "emailBranding", v)} />
      </div>
    ),
    notifications: (
      <div className="space-y-3">
        <AdminToggle label="Email notifications" checked={s.notifications.emailEnabled} onChange={(v) => setSectionValue("notifications", "emailEnabled", v)} />
        <AdminToggle label="SMS notifications" checked={s.notifications.smsEnabled} onChange={(v) => setSectionValue("notifications", "smsEnabled", v)} />
        <AdminToggle label="WhatsApp notifications" checked={s.notifications.whatsappEnabled} onChange={(v) => setSectionValue("notifications", "whatsappEnabled", v)} />
        <AdminToggle label="Push notifications" checked={s.notifications.pushEnabled} onChange={(v) => setSectionValue("notifications", "pushEnabled", v)} />
        <div className="mt-4 rounded-2xl border border-[#EEF2F0] p-4">
          <p className="mb-3 text-sm font-semibold text-[#0A4A4A]">Default notification preferences</p>
          <div className="space-y-2">
            <AdminToggle label="Transactional messages" checked={s.notifications.defaultPreferences.transactional} onChange={(v) => setForm((c) => ({ ...c, notifications: { ...c.notifications, defaultPreferences: { ...c.notifications.defaultPreferences, transactional: v } } }))} />
            <AdminToggle label="Marketing messages" checked={s.notifications.defaultPreferences.marketing} onChange={(v) => setForm((c) => ({ ...c, notifications: { ...c.notifications, defaultPreferences: { ...c.notifications.defaultPreferences, marketing: v } } }))} />
            <AdminToggle label="Weekly digest" checked={s.notifications.defaultPreferences.weeklyDigest} onChange={(v) => setForm((c) => ({ ...c, notifications: { ...c.notifications, defaultPreferences: { ...c.notifications.defaultPreferences, weeklyDigest: v } } }))} />
          </div>
        </div>
      </div>
    ),
    email: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="SMTP host"><AdminInput value={s.email.smtpHost} onChange={(e) => setSectionValue("email", "smtpHost", e.target.value)} /></AdminField>
        <AdminField label="SMTP port"><AdminInput value={s.email.smtpPort} onChange={(e) => setSectionValue("email", "smtpPort", e.target.value)} /></AdminField>
        <AdminField label="SMTP user"><AdminInput value={s.email.smtpUser} onChange={(e) => setSectionValue("email", "smtpUser", e.target.value)} /></AdminField>
        <AdminField label="SMTP password"><AdminInput type="password" value={s.email.smtpPassword} onChange={(e) => setSectionValue("email", "smtpPassword", e.target.value)} /></AdminField>
        <AdminField label="Sender name"><AdminInput value={s.email.senderName} onChange={(e) => setSectionValue("email", "senderName", e.target.value)} /></AdminField>
        <AdminField label="Sender email"><AdminInput value={s.email.senderEmail} onChange={(e) => setSectionValue("email", "senderEmail", e.target.value)} /></AdminField>
        <AdminField label="Test email recipient"><AdminInput value={s.email.testRecipient} onChange={(e) => setSectionValue("email", "testRecipient", e.target.value)} /></AdminField>
        <AdminField label="Email footer" hint="Appended to all outbound emails.">
          <AdminTextarea rows={3} value={s.email.footer} onChange={(e) => setSectionValue("email", "footer", e.target.value)} />
        </AdminField>
      </div>
    ),
    smsWhatsapp: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="SMS provider">
          <AdminSelect value={s.smsWhatsapp.smsProvider} onChange={(e) => setSectionValue("smsWhatsapp", "smsProvider", e.target.value)}>
            <option value="msg91">MSG91</option>
            <option value="twilio">Twilio</option>
            <option value="custom">Custom</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="WhatsApp provider">
          <AdminSelect value={s.smsWhatsapp.whatsappProvider} onChange={(e) => setSectionValue("smsWhatsapp", "whatsappProvider", e.target.value)}>
            <option value="meta_cloud_api">Meta Cloud API</option>
            <option value="gupshup">Gupshup</option>
            <option value="custom">Custom</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="API URL"><AdminInput value={s.smsWhatsapp.apiUrl} onChange={(e) => setSectionValue("smsWhatsapp", "apiUrl", e.target.value)} /></AdminField>
        <AdminField label="API key"><AdminInput type="password" value={s.smsWhatsapp.apiKey} onChange={(e) => setSectionValue("smsWhatsapp", "apiKey", e.target.value)} /></AdminField>
        <AdminField label="Test phone number"><AdminInput value={s.smsWhatsapp.testPhone} onChange={(e) => setSectionValue("smsWhatsapp", "testPhone", e.target.value)} /></AdminField>
      </div>
    ),
    security: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Session timeout (minutes)"><AdminInput type="number" value={s.security.sessionTimeoutMinutes} onChange={(e) => setSectionValue("security", "sessionTimeoutMinutes", Number(e.target.value))} /></AdminField>
        <AdminField label="Admin login security">
          <AdminSelect value={s.security.adminLoginSecurity} onChange={(e) => setSectionValue("security", "adminLoginSecurity", e.target.value)}>
            <option value="otp">OTP only</option>
            <option value="password">Password</option>
            <option value="otp_password">OTP + Password</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="Minimum password length"><AdminInput type="number" value={s.security.passwordMinLength} onChange={(e) => setSectionValue("security", "passwordMinLength", Number(e.target.value))} /></AdminField>
        <AdminField label="Login attempt limit"><AdminInput type="number" value={s.security.loginAttemptLimit} onChange={(e) => setSectionValue("security", "loginAttemptLimit", Number(e.target.value))} /></AdminField>
        <AdminToggle label="Require uppercase letters" checked={s.security.requireUppercase} onChange={(v) => setSectionValue("security", "requireUppercase", v)} />
        <AdminToggle label="Require numbers" checked={s.security.requireNumbers} onChange={(v) => setSectionValue("security", "requireNumbers", v)} />
        <AdminToggle label="Two-factor authentication" checked={s.security.twoFactorEnabled} onChange={(v) => setSectionValue("security", "twoFactorEnabled", v)} />
      </div>
    ),
    general: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Default country"><AdminInput value={s.general.defaultCountry} onChange={(e) => setSectionValue("general", "defaultCountry", e.target.value)} /></AdminField>
        <AdminField label="Default timezone"><AdminInput value={s.general.defaultTimezone} onChange={(e) => setSectionValue("general", "defaultTimezone", e.target.value)} /></AdminField>
        <AdminField label="Default language"><AdminInput value={s.general.defaultLanguage} onChange={(e) => setSectionValue("general", "defaultLanguage", e.target.value)} /></AdminField>
        <AdminField label="Date format"><AdminInput value={s.general.dateFormat} onChange={(e) => setSectionValue("general", "dateFormat", e.target.value)} /></AdminField>
        <AdminField label="Currency format"><AdminInput value={s.general.currencyFormat} onChange={(e) => setSectionValue("general", "currencyFormat", e.target.value)} /></AdminField>
      </div>
    ),
    legal: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Terms & conditions URL"><AdminInput value={s.legal.termsUrl} onChange={(e) => setSectionValue("legal", "termsUrl", e.target.value)} /></AdminField>
        <AdminField label="Privacy policy URL"><AdminInput value={s.legal.privacyUrl} onChange={(e) => setSectionValue("legal", "privacyUrl", e.target.value)} /></AdminField>
        <AdminField label="Disclaimer text"><AdminTextarea rows={4} value={s.legal.disclaimerText} onChange={(e) => setSectionValue("legal", "disclaimerText", e.target.value)} /></AdminField>
        <AdminToggle label="Consent required on signup" checked={s.legal.consentRequired} onChange={(v) => setSectionValue("legal", "consentRequired", v)} />
      </div>
    ),
    media: (
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Max image upload (MB)"><AdminInput type="number" value={s.media.maxImageUploadMb} onChange={(e) => setSectionValue("media", "maxImageUploadMb", Number(e.target.value))} /></AdminField>
        <AdminField label="Max video upload (MB)"><AdminInput type="number" value={s.media.maxVideoUploadMb} onChange={(e) => setSectionValue("media", "maxVideoUploadMb", Number(e.target.value))} /></AdminField>
        <AdminField label="Allowed file types" hint="Comma-separated extensions."><AdminInput value={s.media.allowedFileTypes} onChange={(e) => setSectionValue("media", "allowedFileTypes", e.target.value)} /></AdminField>
        <AdminField label="Storage provider">
          <AdminSelect value={s.media.storageProvider} onChange={(e) => setSectionValue("media", "storageProvider", e.target.value)}>
            <option value="s3">Amazon S3</option>
            <option value="supabase">Supabase Storage</option>
            <option value="local">Local</option>
          </AdminSelect>
        </AdminField>
      </div>
    ),
    backup: (
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] p-4">
          <p className="text-xs uppercase tracking-wide text-[#7A928D]">Backup status</p>
          <p className="mt-1 text-lg font-semibold capitalize text-[#0A4A4A]">{s.backup.status}</p>
        </div>
        <div className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] p-4">
          <p className="text-xs uppercase tracking-wide text-[#7A928D]">Last backup</p>
          <p className="mt-1 text-lg font-semibold text-[#0A4A4A]">
            {s.backup.lastBackupAt ? new Date(s.backup.lastBackupAt).toLocaleString() : "Never"}
          </p>
        </div>
        <div className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] p-4">
          <p className="text-xs uppercase tracking-wide text-[#7A928D]">System health</p>
          <p className="mt-1 text-lg font-semibold capitalize text-[#0A4A4A]">{s.backup.systemHealth}</p>
        </div>
        <div className="rounded-2xl border border-[#EEF2F0] bg-[#FCFDFC] p-4">
          <p className="text-xs uppercase tracking-wide text-[#7A928D]">Version</p>
          <p className="mt-1 text-lg font-semibold text-[#0A4A4A]">{s.backup.version}</p>
        </div>
      </div>
    ),
    advanced: (
      <div className="space-y-4">
        <AdminToggle label="Maintenance mode" checked={s.advanced.maintenanceMode} onChange={(v) => setSectionValue("advanced", "maintenanceMode", v)} />
        <AdminToggle label="Debug mode" checked={s.advanced.debugMode} onChange={(v) => setSectionValue("advanced", "debugMode", v)} />
        <div className="rounded-2xl border border-[#EEF2F0] p-4">
          <p className="mb-3 text-sm font-semibold text-[#0A4A4A]">Feature flags</p>
          <div className="space-y-2">
            {Object.entries(s.advanced.featureFlags || {}).map(([key, value]) => (
              <AdminToggle
                key={key}
                label={key.replace(/([A-Z])/g, " $1")}
                checked={Boolean(value)}
                onChange={(v) =>
                  setForm((c) => ({
                    ...c,
                    advanced: {
                      ...c.advanced,
                      featureFlags: { ...c.advanced.featureFlags, [key]: v },
                    },
                  }))
                }
              />
            ))}
          </div>
        </div>
        <AdminField label="Coming soon features">
          <AdminTextarea rows={3} value={s.advanced.comingSoonFeatures} onChange={(e) => setSectionValue("advanced", "comingSoonFeatures", e.target.value)} />
        </AdminField>
      </div>
    ),
  };

  const active = SETTINGS_SECTIONS.find((item) => item.id === section) || SETTINGS_SECTIONS[0];
  const settingsTabs = SETTINGS_SECTIONS.map((item) => ({
    id: item.id,
    label: item.label,
  }));

  return (
    <AdminPageShell>
        <AdminPageHero
          eyebrow="⚙ Settings"
          title="Platform configuration"
          description="Manage branding, notifications, security, and system preferences for YVITY Admin."
          refreshing={dirty}
          refreshingLabel="Unsaved changes"
        />

        <AdminTabBar
          className="xl:hidden"
          items={settingsTabs}
          value={section}
          onChange={setSection}
          ariaLabel="Settings sections"
          scrollable
        />

        <div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)]">
          <AdminPanel className="hidden xl:block">
            <nav className="space-y-1" aria-label="Settings sections">
              {SETTINGS_SECTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  aria-current={section === item.id ? "page" : undefined}
                  className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
                    section === item.id
                      ? "bg-[#0A4A4A] text-white"
                      : "text-[#0A4A4A] hover:bg-[#E8F4F3]"
                  }`}
                >
                  <span>{item.emoji}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </AdminPanel>

          <AdminPanel>
            <SectionHeader emoji={active.emoji} title={active.label} />
            {sectionContent[section]}
          </AdminPanel>
        </div>

        <AdminPanel>
          <p className="mb-3 text-sm font-semibold text-[#0A4A4A]">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleSave} disabled={isProcessing} className="rounded-full bg-[#0A4A4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              Save settings
            </button>
            <button type="button" onClick={handleReset} disabled={isProcessing} className="rounded-full border border-[#E6ECEA] px-5 py-2.5 text-sm font-semibold text-[#5C7571]">
              Reset settings
            </button>
            <button type="button" onClick={() => handleAction("test_email", { recipient: form.email.testRecipient })} disabled={isProcessing} className="rounded-full border border-[#0A4A4A]/20 px-5 py-2.5 text-sm font-semibold text-[#0A4A4A]">
              Test email
            </button>
            <button type="button" onClick={() => handleAction("test_sms", { phone: form.smsWhatsapp.testPhone })} disabled={isProcessing} className="rounded-full border border-[#0A4A4A]/20 px-5 py-2.5 text-sm font-semibold text-[#0A4A4A]">
              Test SMS
            </button>
            <button type="button" onClick={() => handleAction("test_whatsapp", { phone: form.smsWhatsapp.testPhone })} disabled={isProcessing} className="rounded-full border border-[#0A4A4A]/20 px-5 py-2.5 text-sm font-semibold text-[#0A4A4A]">
              Test WhatsApp
            </button>
            <button type="button" onClick={() => handleAction("backup")} disabled={isProcessing} className="rounded-full border border-[#F59E0B]/30 bg-[#FFF6E8] px-5 py-2.5 text-sm font-semibold text-[#B45309]">
              Create backup
            </button>
          </div>
        </AdminPanel>

      <AdminConfirmDialog {...dialogProps} />
    </AdminPageShell>
  );
}
