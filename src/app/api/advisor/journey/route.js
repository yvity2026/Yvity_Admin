import { NextResponse } from "next/server";

import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";

const VALID_ENTRY_TYPES = ["Education", "Profession", "Certificate"];

const sanitizeJourneyPayload = (body, userId) => {
  const entryType = VALID_ENTRY_TYPES.includes(body.entry_type)
    ? body.entry_type
    : null;

  if (!entryType) {
    throw new Error("Invalid entry type");
  }

  const title = String(body.title || "").trim();

  if (!title) {
    throw new Error("Title is required");
  }

  const serviceCategory =
    entryType === "Education" ? null : body.service_category || null;
  const customServiceCategory =
    entryType === "Education" ? null : body.custom_service_category || null;
  const organisation = body.organisation ? String(body.organisation).trim() : null;
  const description = body.description ? String(body.description).trim() : null;
  const fromYear =
    entryType === "Certificate" || body.from_year === null || body.from_year === undefined || body.from_year === ""
      ? null
      : Number(body.from_year);
  const toYear =
    entryType === "Certificate" || body.to_year === null || body.to_year === undefined || body.to_year === ""
      ? null
      : Number(body.to_year);
  const dateValue =
    entryType === "Certificate" && body.date !== null && body.date !== undefined && body.date !== ""
      ? Number(body.date)
      : null;

  return {
    user_id: userId,
    entry_type: entryType,
    service_category: serviceCategory,
    custom_service_category: customServiceCategory,
    title,
    organisation,
    description,
    from_year: Number.isFinite(fromYear) ? fromYear : null,
    to_year: Number.isFinite(toYear) ? toYear : null,
    date: Number.isFinite(dateValue) ? dateValue : null,
    is_ongoing: entryType === "Profession" ? Boolean(body.is_ongoing) : false,
    degree_or_certificate:
      entryType === "Education" && body.degree_or_certificate
        ? String(body.degree_or_certificate).trim()
        : null,
    institution:
      entryType === "Education" && body.institution
        ? String(body.institution).trim()
        : null,
    certificate_name:
      entryType === "Certificate" && body.certificate_name
        ? String(body.certificate_name).trim()
        : null,
  };
};

export async function POST(req) {
  try {
    const supabase = createAdminClient();
    const user = await ValidateAdvisor();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const payload = sanitizeJourneyPayload(body, user.id);

    const { data, error } = await supabase
      .from("advisor_journey")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: user.id,
    });

    if (recalcResult.error) {
      console.error(
        "recalculate_advisor_score failed after journey create:",
        recalcResult.error
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create journey entry" },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const user = await ValidateAdvisor();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("advisor_journey")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch journey entries" },
      { status: 400 }
    );
  }
}
