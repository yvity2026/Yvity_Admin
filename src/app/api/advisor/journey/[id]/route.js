import { NextResponse } from "next/server";

import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";

const VALID_ENTRY_TYPES = ["Education", "Profession", "Certificate"];

const sanitizeJourneyPayload = (body) => {
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
    entry_type: entryType,
    service_category: entryType === "Education" ? null : body.service_category || null,
    custom_service_category:
      entryType === "Education" ? null : body.custom_service_category || null,
    title,
    organisation: body.organisation ? String(body.organisation).trim() : null,
    description: body.description ? String(body.description).trim() : null,
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
    updated_at: new Date().toISOString(),
  };
};

export async function PUT(req, context) {
  try {
    const supabase = createAdminClient();
    const user = await ValidateAdvisor();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = await req.json();
    const payload = sanitizeJourneyPayload(body);

    const { data, error } = await supabase
      .from("advisor_journey")
      .update(payload)
      .eq("id", id)
      .eq("user_id", user.id)
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
        "recalculate_advisor_score failed after journey update:",
        recalcResult.error
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update journey entry" },
      { status: 400 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const supabase = createAdminClient();
    const user = await ValidateAdvisor();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const { error } = await supabase
      .from("advisor_journey")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: user.id,
    });

    if (recalcResult.error) {
      console.error(
        "recalculate_advisor_score failed after journey delete:",
        recalcResult.error
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete journey entry" },
      { status: 400 }
    );
  }
}
