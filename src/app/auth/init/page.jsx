"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { cookies, cookies } from "next/headers"

export default function InitPage() {
  const router = useRouter()
const cookiestore = cookies();
  useEffect(async() => {
    // const userId = sessionStorage.getItem("userId") || 
    const userId = (await cookiestore).get()

    if (!userId) {
      router.push("/login")
      return
    }

    fetch("/api/auth/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    }).then(() => {
      router.push("/dashboard")
    })
  }, [])

  return <p>Setting up session...</p>
}