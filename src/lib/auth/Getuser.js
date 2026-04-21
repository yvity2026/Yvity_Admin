import { cookies } from "next/headers"

export function getUser() {
  const cookieStore = cookies()
  const token = cookieStore.get("security_token")?.value

  if (!session) return null

  return JSON.parse(session)
}