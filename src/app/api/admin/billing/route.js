import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  extendSubscription,
  getBillingSnapshot,
} from "@/lib/local-data/billing-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import {
  extendSubscriptionInSupabase,
  getBillingSnapshotFromSupabase,
} from "@/lib/supabase/billing-queries";

async function parseAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("admin_session")?.value;
  if (!sessionValue) return null;
  try {
    return JSON.parse(sessionValue);
  } catch {
    return null;
  }
}

async function requireAdmin() {
  const session = await parseAdminSession();
  if (!session?.admin_id || !session?.role) return null;
  return session;
}

export async function GET(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const opts = {
      filter: searchParams.get("filter") || "all",
      sort: searchParams.get("sort") || "expiry_asc",
      search: searchParams.get("search") || "",
      page: searchParams.get("page") || 1,
      limit: searchParams.get("limit") || 20,
    };

    if (localDataAvailable()) {
      return NextResponse.json(getBillingSnapshot(opts));
    }
    return NextResponse.json(await getBillingSnapshotFromSupabase(opts));
  } catch (error) {
    console.error("Admin billing GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = payload;

  try {
    if (action === "extend_subscription") {
      const { userId, extendDays, note } = payload;
      if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });

      const result = localDataAvailable()
        ? extendSubscription(userId, { extendDays, note })
        : await extendSubscriptionInSupabase(userId, { extendDays, note });

      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin billing POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
