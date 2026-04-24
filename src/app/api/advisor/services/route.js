import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// GET - Fetch all services for an advisor
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const advisorId = searchParams.get('advisorId');

    if (!advisorId) {
      return NextResponse.json(
        { error: "Advisor ID is required" },
        { status: 400 }
      );
    }

    const services = await sql`
      SELECT * FROM advisor_services 
      WHERE advisor_id = ${advisorId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({ 
      success: true, 
      services: services.rows 
    });
    
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST - Create a new service
export async function POST(request) {
  try {
    const body = await request.json();
    const { serviceType, company, experience, services, advisorId } = body;

    // Validate required fields
    if (!serviceType || !company || !experience || !services || !advisorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO advisor_services (
        advisor_id,
        service_type,
        company,
        experience,
        services,
        created_at,
        updated_at
      ) VALUES (
        ${advisorId},
        ${serviceType},
        ${company},
        ${experience},
        ${JSON.stringify(services)},
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({ 
      success: true, 
      service: result.rows[0] 
    });
    
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}