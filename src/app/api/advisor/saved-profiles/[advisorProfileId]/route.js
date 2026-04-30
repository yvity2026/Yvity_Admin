import { ValidateUser } from "@/lib/auth/ValidateUser";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { removeSavedProfile } from "@/lib/advisor/saved-profiles/savedProfilesService";

/**
 * DELETE /api/advisor/saved-profiles/[advisorProfileId]
 * Remove a saved advisor profile for authenticated user
 * Params: advisorProfileId
 */
export async function DELETE(req, { params }) {
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
    const result = await removeSavedProfile(supabase, user.id, advisorProfileId);

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
        message: result.message,
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
