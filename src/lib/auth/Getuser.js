import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore =  await cookies()
  const token = cookieStore.get("security_token")?.value
  if (!token) return null;
console.log(token)
  return JSON.parse(token);
}