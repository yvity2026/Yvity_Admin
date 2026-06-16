import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/adminSession";
import {
  createCoupon,
  getCouponsSnapshot,
  revokeCoupon,
} from "@/lib/local-data/coupons-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

export async function GET() {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!localDataAvailable()) {
      return NextResponse.json(
        { error: "Coupons are available in local data mode only for now" },
        { status: 501 },
      );
    }

    return NextResponse.json(getCouponsSnapshot());
  } catch (error) {
    console.error("Admin coupons GET failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!localDataAvailable()) {
    return NextResponse.json(
      { error: "Coupons are available in local data mode only for now" },
      { status: 501 },
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { action } = payload;

  try {
    if (action === "create") {
      const result = createCoupon(payload, adminSession.admin_id);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "revoke") {
      const { couponId } = payload;
      if (!couponId) {
        return NextResponse.json({ error: "couponId is required" }, { status: 400 });
      }

      const result = revokeCoupon(couponId);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin coupons POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
