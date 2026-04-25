import { ValidateAdvisor } from "@/lib/auth/ValidateAdvisor";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET - Fetch all services for an advisor
export async function GET(request) {
  try {
    const advisor = await ValidateAdvisor();

    if (!advisor.id) {
      return NextResponse.json(
        { error: "Advisor ID is required" },
        { status: 400 },
      );
    }
    const supabase = createAdminClient();

    const { data: services, error } = await supabase
      .from("advisor_services")
      .select("*")
      .eq("advisor_id", advisor.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    }

    return NextResponse.json({
      success: true,
      services: services || [],
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 },
    );
  }
}

// POST - Create a new service
export async function POST(request) {
  try {
    const body = await request.json();
    const { serviceType, company, experience, services } = body;
    const advisor = await ValidateAdvisor();
    if (!advisor || !advisor.id) {
      return NextResponse.json(
        { error: "Advisor profile not found" },
        { status: 400 },
      );
    }
    if (!serviceType || !company || !experience || !services) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("advisor_services")
      .insert([
        {
          advisor_id: advisor.id,
          service_type: serviceType,
          company,
          experience_years : experience,
          key_services : services, // no JSON.stringify needed if column is json/jsonb
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: "Failed to create service" },
        { status: 500 },
      );
    }

    const recalcResult = await supabase.rpc("recalculate_advisor_score", {
      p_advisor: advisor.id,
    });

    if (recalcResult.error) {
      console.error("recalculate_advisor_score failed after service create:", recalcResult.error);
    }

    return NextResponse.json({
      success: true,
      service: data,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 },
    );
  }
}
