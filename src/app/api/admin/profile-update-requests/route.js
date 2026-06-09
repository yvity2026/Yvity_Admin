import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  approveLocalProfileUpdateRequest,
  rejectLocalProfileUpdateRequest,
  useLocalProfileUpdateRequests,
} from "@/lib/local-data/profile-update-requests";

async function parseAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("admin_session")?.value;

  if (!sessionValue) {
    return null;
  }

  try {
    return JSON.parse(sessionValue);
  } catch (error) {
    console.error("Invalid admin session cookie", error);
    return null;
  }
}

async function requireAdmin() {
  const session = await parseAdminSession();
  if (!session || !session.admin_id || !session.role) {
    return null;
  }
  return session;
}

export async function POST(request) {
  const adminSession = await requireAdmin();

  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action, requestId, reason, note, verificationNotes } = payload;

  if (!requestId) {
    return NextResponse.json({ error: "requestId is required" }, { status: 400 });
  }

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  if (!useLocalProfileUpdateRequests()) {
    return NextResponse.json(
      { error: "Profile update requests are not available in this environment" },
      { status: 501 },
    );
  }

  try {
    if (action === "approve") {
      const updated = approveLocalProfileUpdateRequest(requestId, verificationNotes);
      if (!updated) {
        return NextResponse.json({ error: "Profile update request not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, request: updated });
    }

    const updated = rejectLocalProfileUpdateRequest(
      requestId,
      reason || note || "Profile update requires changes",
    );
    if (!updated) {
      return NextResponse.json({ error: "Profile update request not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Profile update request POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
