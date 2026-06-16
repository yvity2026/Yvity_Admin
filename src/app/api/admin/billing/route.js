import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/adminSession";
import {
  extendSubscription,
  getBillingSnapshot,
} from "@/lib/local-data/billing-store";
import { localDataAvailable } from "@/lib/local-data/advisor-approvals";

export async function GET(request) {
  const adminSession = await requireAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!localDataAvailable()) {
      return NextResponse.json(
        { error: "Billing is available in local data mode only for now" },
        { status: 501 },
      );
    }

    const { searchParams } = new URL(request.url);
    return NextResponse.json(
      getBillingSnapshot({
        filter: searchParams.get("filter") || "all",
        sort: searchParams.get("sort") || "expiry_asc",
        search: searchParams.get("search") || "",
        page: searchParams.get("page") || 1,
        limit: searchParams.get("limit") || 20,
      }),
    );
  } catch (error) {
    console.error("Admin billing GET failed", error);
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
      { error: "Billing is available in local data mode only for now" },
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
    if (action === "extend_subscription") {
      const { userId, extendDays, note } = payload;
      if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
      }
      const result = extendSubscription(userId, { extendDays, note });
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: result.status || 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin billing POST failed", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
