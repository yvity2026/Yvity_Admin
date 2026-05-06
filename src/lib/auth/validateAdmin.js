import { cookies } from "next/headers";

export async function validateAdmin() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
console.log(session)
    if (!session?.value) {
      return null;
    }


    return JSON.parse(session.value); 
  } catch (error) {
    console.error("validateAdmin error:", error);
    return null;
  }
}