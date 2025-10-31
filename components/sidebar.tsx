"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Key, Plus, Users, LogOut, BarChart3, Zap, Home, X, CreditCard } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const [role, setRole] = useState<string>("")

  useEffect(() => {
    const session = localStorage.getItem("xyriel_session")
    if (session) {
      const data = JSON.parse(session)
      setRole(data.role)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("xyriel_session")
    router.push("/login")
  }

  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Key, label: "License Keys", href: "/keys" },
    { icon: Plus, label: "Generate Key", href: "/generate-key" },
    { icon: Zap, label: "Devices", href: "/devices" },
    { icon: CreditCard, label: "Plans", href: "/plans" },
  ]

  const ownerItems = [
    { icon: Users, label: "User Management", href: "/user-management" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 z-40 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-sidebar-border">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
              X
            </div>
            <div>
              <p className="font-bold text-sm">Xyriel Panel</p>
              <p className="text-xs text-sidebar-foreground/60">Admin Dashboard</p>
            </div>
            <button onClick={onClose} className="ml-auto md:hidden p-1 hover:bg-sidebar-accent rounded ripple-button">
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground ripple-button"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {role === "owner" && (
            <>
              <div className="border-t border-sidebar-border pt-4">
                <p className="text-xs font-semibold text-sidebar-foreground/60 px-4 mb-2">OWNER ONLY</p>
                <nav className="space-y-2">
                  {ownerItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground ripple-button"
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="border-t border-sidebar-border pt-4">
                <Link
                  href="/devices"
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground ripple-button text-xs font-semibold"
                >
                  <Zap size={18} />
                  <span>Active Devices</span>
                </Link>
              </div>
            </>
          )}

          <div className="border-t border-sidebar-border pt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors ripple-button"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
