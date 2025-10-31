"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem("xyriel_session")
    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return null
}
