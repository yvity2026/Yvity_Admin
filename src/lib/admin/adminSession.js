import { cookies } from "next/headers";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get("admin_session")?.value;
  if (!sessionValue) return null;

  try {
    return JSON.parse(sessionValue);
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session?.admin_id || !session?.role) return null;
  return session;
}
