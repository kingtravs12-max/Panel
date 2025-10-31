"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AnalyticsPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [planDistribution, setPlanDistribution] = useState([
    { name: "Free", value: 8, color: "#FFEB3B" },
    { name: "Premium", value: 4, color: "#4CAF50" },
    { name: "Lifetime", value: 2, color: "#FF5252" },
  ])

  useEffect(() => {
    const sessionData = localStorage.getItem("xyriel_session")
    if (!sessionData) {
      router.push("/login")
    } else {
      const data = JSON.parse(sessionData)
      if (data.role !== "owner") {
        router.push("/dashboard")
      }
      setSession(data)
    }

    // Function to calculate real plan distribution from all users
    const updatePlanDistribution = () => {
      const allUsers = JSON.parse(localStorage.getItem("xyriel_users") || "[]")

      let freeCount = 0
      let premiumCount = 0
      let lifetimeCount = 0

      allUsers.forEach((user: any) => {
        if (user.plan === "free" || !user.plan) {
          freeCount++
        } else if (user.plan === "lifetime") {
          lifetimeCount++
        } else if (user.plan && user.plan.startsWith("premium")) {
          premiumCount++
        }
      })

      setPlanDistribution([
        { name: "Free", value: Math.max(freeCount, 1), color: "#FFEB3B" },
        { name: "Premium", value: Math.max(premiumCount, 1), color: "#4CAF50" },
        { name: "Lifetime", value: Math.max(lifetimeCount, 1), color: "#FF5252" },
      ])
    }

    // Initial load
    updatePlanDistribution()

    // Listen for storage changes to update when other tabs/pages change user plans
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "xyriel_users") {
        updatePlanDistribution()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also poll periodically to catch updates within the same tab
    const interval = setInterval(updatePlanDistribution, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      clearInterval(interval)
    }
  }, [router])

  const userGrowthData = [
    { name: "Jan", users: 4, keys: 8 },
    { name: "Feb", users: 6, keys: 12 },
    { name: "Mar", users: 8, keys: 16 },
    { name: "Apr", users: 10, keys: 24 },
    { name: "May", users: 12, keys: 36 },
    { name: "Jun", users: 14, keys: 48 },
  ]

  const deviceData = [
    { name: "Week 1", devices: 5 },
    { name: "Week 2", devices: 8 },
    { name: "Week 3", devices: 12 },
    { name: "Week 4", devices: 23 },
  ]

  if (!session || session.role !== "owner") return null

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-64 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">System-wide statistics and insights</p>
          </div>

          {/* User Growth Chart */}
          <Card className="border border-black/20 dark:border-white/20">
            <CardHeader>
              <CardTitle>User & Key Growth</CardTitle>
              <CardDescription>Monthly growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" />
                    <Line type="monotone" dataKey="keys" stroke="#8b5cf6" strokeWidth={2} name="Keys" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Devices Chart */}
          <Card className="border border-black/20 dark:border-white/20">
            <CardHeader>
              <CardTitle>Active Devices</CardTitle>
              <CardDescription>Weekly active devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="devices" fill="#10b981" name="Active Devices" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution - Real-time updates */}
          <Card className="border border-black/20 dark:border-white/20">
            <CardHeader>
              <CardTitle>Plan Distribution</CardTitle>
              <CardDescription>Users by subscription plan (updates in real-time)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={300}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
