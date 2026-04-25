import { ValidateUser } from "@/lib/auth/ValidateUser";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await ValidateUser();
    console.log(user);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: 2,
          message: "User Not Found",
          error: "user not found based on the userId",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        code: 3,
        message: "user Retrieved successfully",
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        code: 4,
        message: "Internal Server Error",
        error: error.message || error,
      },
      { status: 500 }
    );
  }
}