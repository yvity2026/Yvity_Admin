import { ValidateUser } from "@/lib/auth/ValidateUser";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import {
  saveAdvisorProfile,
  getSavedProfiles,
  removeSavedProfile,
} from "@/lib/advisor/saved-profiles/savedProfilesService";

/**
 * GET /api/advisor/saved-profiles
 * Fetch saved advisor profiles for authenticated user with pagination
 * Query params: page (default: 1), limit (default: 10, max: 50)
 */
export async function GET(req) {
  try {
    const user = await ValidateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login.", statusCode: 401 },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;

    const result = await getSavedProfiles(supabase, user.id, page, limit);

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          statusCode: 500,
          success: false,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: result.data,
        pagination: result.pagination,
        message: "Saved profiles fetched successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message || "Something went wrong",
        statusCode: 500,
        success: false,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/advisor/saved-profiles
 * Save an advisor profile for authenticated user
 * Body: { advisorProfileId: string }
 */
export async function POST(req) {
  try {
    const user = await ValidateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login.", statusCode: 401 },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { advisorProfileId } = body;

    if (!advisorProfileId) {
      return NextResponse.json(
        {
          error: "Advisor Profile ID is required",
          statusCode: 400,
          success: false,
        },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const result = await saveAdvisorProfile(supabase, user.id, advisorProfileId);

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          statusCode: 500,
          success: false,
        },
        { status: 500 }
      );
    }

    const statusCode = result.isNew ? 201 : 200;

    return NextResponse.json(
      {
        success: true,
        statusCode,
        data: result.data,
        message: result.message,
        isNew: result.isNew,
      },
      { status: statusCode }
    );
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message || "Something went wrong",
        statusCode: 500,
        success: false,
      },
      { status: 500 }
    );
  }
}
