import { ValidateUser } from "@/lib/auth/ValidateUser";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { checkIfProfileSaved } from "@/lib/advisor/saved-profiles/savedProfilesService";

/**
 * GET /api/advisor/saved-profiles/check/:advisorProfileId
 * Check if an advisor profile is saved by authenticated user
 * Params: advisorProfileId
 */
export async function GET(req, { params }) {
  try {
    const user = await ValidateUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please login.", statusCode: 401 },
        { status: 401 }
      );
    }

    const { advisorProfileId } = params;

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
    const result = await checkIfProfileSaved(supabase, user.id, advisorProfileId);

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
        data: {
          isSaved: result.isSaved,
          savedProfileId: result.savedProfileId,
          advisorProfileId,
        },
        message: result.isSaved
          ? "Profile is saved"
          : "Profile is not saved",
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
