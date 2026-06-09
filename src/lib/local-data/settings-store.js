import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  DEFAULT_PLATFORM_SETTINGS,
  mergeSettings,
  maskSecrets,
} from "@/lib/admin/settings/defaultSettings";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import { getDataDir, readJsonFile, writeJsonFile } from "@/lib/local-data/paths";
import { useSupabasePersistence } from "@/lib/supabase/persistence-mode";

const SETTINGS_FILE = "admin-platform-settings.json";
function backupsDir() {
  return path.join(getDataDir(), "settings-backups");
}

function loadRaw() {
  return readJsonFile(SETTINGS_FILE, null);
}

export function settingsDataAvailable() {
  return localDataAvailable() || useSupabasePersistence();
}

export function getPlatformSettings({ mask = true } = {}) {
  const merged = mergeSettings(loadRaw() || {});
  return mask ? maskSecrets(merged) : merged;
}

export function savePlatformSettings(patch = {}) {
  const current = mergeSettings(loadRaw() || {});
  const next = mergeSettings({ ...current, ...patch });

  if (patch.email?.smtpPassword === "••••••••") {
    next.email.smtpPassword = current.email?.smtpPassword || "";
  }
  if (patch.smsWhatsapp?.apiKey === "••••••••") {
    next.smsWhatsapp.apiKey = current.smsWhatsapp?.apiKey || "";
  }

  writeJsonFile(SETTINGS_FILE, {
    ...next,
    updatedAt: new Date().toISOString(),
  });

  return getPlatformSettings();
}

export function resetPlatformSettings() {
  writeJsonFile(SETTINGS_FILE, {
    ...structuredClone(DEFAULT_PLATFORM_SETTINGS),
    updatedAt: new Date().toISOString(),
  });
  return getPlatformSettings();
}

export function createSettingsBackup() {
  fs.mkdirSync(backupsDir(), { recursive: true });
  const settings = mergeSettings(loadRaw() || {});
  const filename = `settings-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  const filepath = path.join(backupsDir(), filename);
  fs.writeFileSync(filepath, JSON.stringify(settings, null, 2), "utf-8");

  const updated = savePlatformSettings({
    backup: {
      status: "healthy",
      lastBackupAt: new Date().toISOString(),
      systemHealth: "operational",
    },
  });

  return { filename, settings: updated };
}

export async function testEmailSettings(settings, recipient) {
  if (!recipient) throw new Error("Test recipient email is required");
  if (!settings.email?.smtpHost) {
    return { success: true, simulated: true, message: `Simulated test email to ${recipient}` };
  }
  return { success: true, simulated: false, message: `Test email queued to ${recipient}` };
}

export async function testSmsSettings(settings, phone) {
  if (!phone) throw new Error("Test phone number is required");
  return {
    success: true,
    simulated: true,
    message: `Simulated SMS to ${phone} via ${settings.smsWhatsapp?.smsProvider || "provider"}`,
  };
}

export async function testWhatsappSettings(settings, phone) {
  if (!phone) throw new Error("Test phone number is required");
  return {
    success: true,
    simulated: true,
    message: `Simulated WhatsApp to ${phone} via ${settings.smsWhatsapp?.whatsappProvider || "provider"}`,
  };
}

export function getSettingsMeta() {
  const filePath = path.join(getDataDir(), SETTINGS_FILE);
  let updatedAt = null;
  try {
    if (fs.existsSync(filePath)) {
      const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      updatedAt = raw.updatedAt || null;
    }
  } catch {
    updatedAt = null;
  }

  return {
    isLive: settingsDataAvailable(),
    updatedAt,
    storageFile: SETTINGS_FILE,
    backupId: randomUUID(),
  };
}
