 
import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { error } from "node:console";

export async function PUT(request,  context ) {
  try {
      console.log("FDGHFGGFDS")
    const id = context.params?.id || (await context.params)?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const body = await request.json();

    const { serviceType, company, experience, services } = body;

    const advisor = await ValidateAdvisor();

    if (!advisor || !advisor.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_services")
      .update({
        service_type: serviceType,
        company,
        experience_years : experience,
        key_services : services,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("advisor_id", advisor.id)
      .select()
      .single();

    if (error) throw error;

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: advisor.id,
    });

    if (recalcResult.error) {
      console.error("recalculate_advisor_score failed after service update:", recalcResult.error);
    }

    return NextResponse.json({ success: true, service: data });
  } catch (err) {
    console.log(error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

 
export async function DELETE(request, context ) {
  try {
    const id = context.params?.id || (await context.params)?.id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const advisor = await ValidateAdvisor();

    if (!advisor || !advisor.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("advisor_services")
      .delete()
      .eq("id", id)
      .eq("advisor_id", advisor.id);

    if (error) throw error;

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: advisor.id,
    });

    if (recalcResult.error) {
      console.error("recalculate_advisor_score failed after service delete:", recalcResult.error);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
