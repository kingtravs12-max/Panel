"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Menu, X, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"

interface HeaderProps {
  onMenuToggle: (open: boolean) => void
  isSidebarOpen: boolean
}

export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const [isDark, setIsDark] = useState(false)
  const [username, setUsername] = useState("")
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [profileImage, setProfileImage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem("xyriel_session")
    if (session) {
      const data = JSON.parse(session)
      setUsername(data.username)
      setProfileImage(data.profileImage || "")
    }

    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    const handleStorageChange = () => {
      const updatedSession = localStorage.getItem("xyriel_session")
      if (updatedSession) {
        const data = JSON.parse(updatedSession)
        setProfileImage(data.profileImage || "")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle("dark")
    setIsDark(!isDark)
    localStorage.setItem("theme", isDark ? "light" : "dark")
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
    setIsProfileOpen(false)
  }

  const confirmLogout = () => {
    localStorage.removeItem("xyriel_session")
    router.push("/login")
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onMenuToggle(!isSidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg transition-colors ripple-button"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2 hover:bg-muted rounded-lg transition-colors ripple-button">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-4 pr-2 hover:bg-muted p-2 rounded-lg transition-colors ripple-button"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs overflow-hidden">
              {profileImage ? (
                <img src={profileImage || "/placeholder.svg"} alt={username} className="w-full h-full object-cover" />
              ) : (
                username.charAt(0).toUpperCase()
              )}
            </div>
            <span className="text-sm font-medium hidden sm:inline">{username}</span>
            <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-muted transition-colors first:rounded-t-lg ripple-button"
              >
                Settings
              </Link>
              <Link
                href="/subscriptions"
                onClick={() => setIsProfileOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-muted transition-colors ripple-button"
              >
                Subscriptions
              </Link>
              <Link
                href="/plans"
                onClick={() => setIsProfileOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-muted transition-colors ripple-button"
              >
                Plans
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors last:rounded-b-lg ripple-button"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowLogoutConfirm(false)} />
          <Card className="relative w-full max-w-md mx-4 border-2 border-black/20">
            <CardHeader>
              <CardTitle>Confirm Logout</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Are you sure you want to logout?</p>
              <div className="flex gap-2">
                <button
                  onClick={confirmLogout}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors ripple-button font-medium"
                >
                  YES
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors ripple-button font-medium"
                >
                  NO
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </header>
  )
}
