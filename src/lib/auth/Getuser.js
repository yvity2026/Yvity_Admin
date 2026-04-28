import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth/jwt/VerifyJwt";

export async function getUser() {
  const cookieStore = await cookies(); // no need for await
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  const payload = verifyJwt(token);

  if (!payload) return null;

  return payload; // { id, roles, ... }
}