"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, Users, Zap, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const sessionData = localStorage.getItem("xyriel_session")
    if (!sessionData) {
      router.push("/login")
    } else {
      setSession(JSON.parse(sessionData))
    }
  }, [router])

  if (!session) return null

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: "12",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      icon: Key,
      label: "Total Keys",
      value: "48",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      icon: Zap,
      label: "Active Devices",
      value: "23",
      color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    },
    {
      icon: TrendingUp,
      label: "Balance",
      value: `$${session.balance}`,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-64 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.username}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="border border-black/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border border-black/20 bg-gradient-to-br from-blue-500/5 via-background to-cyan-500/5">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push("/generate-key")}
                  className="p-4 border border-black/20 rounded-lg hover:bg-primary/10 transition-colors text-left ripple-button group"
                >
                  <p className="font-semibold group-hover:text-primary transition-colors">Generate New Key</p>
                  <p className="text-sm text-muted-foreground">Create a new license key</p>
                </button>
                <button
                  onClick={() => router.push("/keys")}
                  className="p-4 border border-black/20 rounded-lg hover:bg-primary/10 transition-colors text-left ripple-button group"
                >
                  <p className="font-semibold group-hover:text-primary transition-colors">View Keys</p>
                  <p className="text-sm text-muted-foreground">Manage your license keys</p>
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="p-4 border border-black/20 rounded-lg hover:bg-primary/10 transition-colors text-left ripple-button group"
                >
                  <p className="font-semibold group-hover:text-primary transition-colors">Settings</p>
                  <p className="text-sm text-muted-foreground">Update your profile</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2025 · Made by Xyriel · All rights reserved</p>
        </footer>
      </main>
    </div>
  )
}
