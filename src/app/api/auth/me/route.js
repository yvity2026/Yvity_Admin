import { apiResponse } from "@/lib/apiResponse";
import { ValidateUser } from "@/lib/auth/ValidateUser";

export async function GET() {
  try {
    const user = await ValidateUser()
    console.log(user)
    if (!user) {
      return apiResponse(
        "User Not Found",
        false,
        2,
        "",
        "user not found based on the userId",
      );
    }
    return apiResponse("user Retrieved successfully", true, 3, user, "");
  } catch (error) {
    console.log(error);
    return apiResponse(
      "Internal Server Error",
      false,
      4,
      "",
      error.message || error,
    );
  }
}
