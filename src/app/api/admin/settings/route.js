import { NextResponse } from "next/server";
import { hasPermission } from "@/lib/admin/permissions";
import {
  createSettingsBackup,
  getPlatformSettings,
  getSettingsMeta,
  resetPlatformSettings,
  savePlatformSettings,
  settingsDataAvailable,
  testEmailSettings,
  testSmsSettings,
  testWhatsappSettings,
} from "@/lib/local-data/settings-store";
import { getAuthenticatedAdmin } from "@/lib/auth/getAuthenticatedAdmin";
import { ensurePlatformDataReady } from "@/lib/supabase/platform-data-bootstrap";

export async function GET() {
  try {
    await ensurePlatformDataReady();
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasPermission(admin, "settings")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!settingsDataAvailable()) {
      return NextResponse.json(
        { error: "Settings storage unavailable. Configure Supabase or shared data for local dev." },
        { status: 501 },
      );
    }

    return NextResponse.json({
      success: true,
      data: getPlatformSettings(),
      meta: getSettingsMeta(),
    });
  } catch (error) {
    console.error("GET /api/admin/settings failed:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasPermission(admin, "settings")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!settingsDataAvailable()) {
      return NextResponse.json({ error: "Settings storage unavailable" }, { status: 501 });
    }

    const body = await request.json();
    const data = savePlatformSettings(body?.settings || body);

    return NextResponse.json({ success: true, data, meta: getSettingsMeta() });
  } catch (error) {
    console.error("PUT /api/admin/settings failed:", error);
    return NextResponse.json({ error: error.message || "Unable to save settings" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!hasPermission(admin, "settings")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!settingsDataAvailable()) {
      return NextResponse.json({ error: "Settings storage unavailable" }, { status: 501 });
    }

    const body = await request.json();
    const action = body?.action;
    const settings = getPlatformSettings({ mask: false });

    switch (action) {
      case "reset":
        return NextResponse.json({ success: true, data: resetPlatformSettings(), message: "Settings reset" });
      case "backup":
        return NextResponse.json({ success: true, ...createSettingsBackup(), message: "Backup created" });
      case "test_email": {
        const result = await testEmailSettings(settings, body?.recipient || settings.email?.testRecipient);
        return NextResponse.json({ success: true, ...result });
      }
      case "test_sms": {
        const result = await testSmsSettings(settings, body?.phone || settings.smsWhatsapp?.testPhone);
        return NextResponse.json({ success: true, ...result });
      }
      case "test_whatsapp": {
        const result = await testWhatsappSettings(settings, body?.phone || settings.smsWhatsapp?.testPhone);
        return NextResponse.json({ success: true, ...result });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("POST /api/admin/settings failed:", error);
    return NextResponse.json({ error: error.message || "Action failed" }, { status: 500 });
  }
}
