import { apiResponse } from "@/lib/ApiResponse";
import { getUser } from "@/lib/auth/Getuser";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
    try {
        const userId = getUser();
        if(!userId){
            apiResponse("something went wrong please try again",false, 1, "", "Unable to get the token from the sessions");
        }
        const {data , error} = await supabaseAdmin.from("profiles").select("*").eq("userId", userId).single();
        if(error){
            apiResponse("User Not Found", false, 2, "", "user not found based on the userId");
        }
        apiResponse("user Retrieved successfully", true, 3, data, "");
    } catch (error) {
        apiResponse("Internal Server Error", false, 4, "", error.message || error);
    }
}