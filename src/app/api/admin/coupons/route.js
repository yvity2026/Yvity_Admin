import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  createCoupon,
  getCouponsSnapshot,
  revokeCoupon,
} from "@/lib/local-data/coupons-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";
import {
  createCouponInSupabase,
  getCouponsSnapshotFromSupabase,
  revokeCouponInSupabase,
} from "@/lib/supabase/coupons-queries";

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

export async function GET() {
  const adminSession = await requireAdmin();
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    if (localDataAvailable()) return NextResponse.json(getCouponsSnapshot());
    return NextResponse.json(await getCouponsSnapshotFromSupabase());
  } catch (error) {
    console.error("Admin coupons GET failed", error);
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
  const local = localDataAvailable();

  try {
    if (action === "create") {
      const result = local
        ? createCoupon(payload, adminSession.admin_id)
        : await createCouponInSupabase(payload, adminSession.admin_id);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    if (action === "revoke") {
      const { couponId } = payload;
      if (!couponId) return NextResponse.json({ error: "couponId is required" }, { status: 400 });
      const result = local
        ? revokeCoupon(couponId)
        : await revokeCouponInSupabase(couponId);
      if (result.error) return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin coupons POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
