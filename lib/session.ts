export interface SessionData {
  userId: number
  username: string
  role: "owner" | "admin" | "user"
  plan: "free" | "premium"
  balance: number
}

export function setSession(data: SessionData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("xyriel_session", JSON.stringify(data))
  }
}

export function getSession(): SessionData | null {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("xyriel_session")
    return session ? JSON.parse(session) : null
  }
  return null
}

export function clearSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("xyriel_session")
  }
}
