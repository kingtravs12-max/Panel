"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Shield, Lock, Unlock } from "lucide-react"

interface User {
  id: number
  username: string
  role: "owner" | "admin" | "user"
  status: "active" | "blocked"
  plan: "free" | "premium"
  keys: number
  devices: number
  adminExpiry?: string
}

interface PlanUpgradeModal {
  isOpen: boolean
  userId: number | null
  username: string
  currentPlan: string
}

export default function UserManagementPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      username: "Xyriel pogi",
      role: "owner",
      status: "active",
      plan: "premium",
      keys: 50,
      devices: 100,
    },
    {
      id: 2,
      username: "test",
      role: "user",
      status: "active",
      plan: "free",
      keys: 5,
      devices: 3,
    },
    {
      id: 3,
      username: "ivan",
      role: "admin",
      status: "active",
      plan: "premium",
      keys: 30,
      devices: 50,
      adminExpiry: "2025-10-27",
    },
  ])
  const [planModal, setPlanModal] = useState<PlanUpgradeModal>({
    isOpen: false,
    userId: null,
    username: "",
    currentPlan: "",
  })

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
  }, [router])

  const handleMakeAdmin = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: "admin" as const } : user)))
  }

  const handleRemoveAdmin = (userId: number) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: "user" as const } : user)))
  }

  const handleBlockUser = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "blocked" : "active" } : user,
      ),
    )
  }

  const handleDeleteUser = (userId: number) => {
    if (userId === 1) {
      alert("Cannot delete owner account")
      return
    }
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleUpgradePlan = (userId: number, username: string, currentPlan: string) => {
    setPlanModal({
      isOpen: true,
      userId,
      username,
      currentPlan,
    })
  }

  const confirmPlanChange = (newPlan: string) => {
    if (planModal.userId) {
      const updatedUsers = users.map((user) =>
        user.id === planModal.userId ? { ...user, plan: newPlan as "free" | "premium" } : user,
      )
      setUsers(updatedUsers)

      localStorage.setItem("xyriel_users", JSON.stringify(updatedUsers))
      window.dispatchEvent(new Event("storage"))

      setPlanModal({ isOpen: false, userId: null, username: "", currentPlan: "" })
      alert(`Plan updated to ${newPlan.toUpperCase()}`)
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "admin":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  if (!session || session.role !== "owner") return null

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {planModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setPlanModal({ ...planModal, isOpen: false })} />
          <Card className="relative w-full max-w-md mx-4 border border-black/20">
            <CardHeader>
              <CardTitle>Change User Plan</CardTitle>
              <CardDescription>
                Change plan for {planModal.username} (Current: {planModal.currentPlan.toUpperCase()})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={planModal.currentPlan === "free" ? "default" : "outline"}
                  onClick={() => confirmPlanChange("free")}
                  className="ripple-button"
                >
                  Free Plan
                </Button>
                <Button
                  variant={planModal.currentPlan === "premium" ? "default" : "outline"}
                  onClick={() => confirmPlanChange("premium")}
                  className="ripple-button"
                >
                  Premium Plan
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full ripple-button"
                onClick={() => setPlanModal({ isOpen: false, userId: null, username: "", currentPlan: "" })}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="pt-20 md:ml-64 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage users, admins, and their plans (Owner Only)</p>
          </div>

          <Card className="border border-black/20">
            <CardHeader>
              <CardTitle>User Management (Owner Only)</CardTitle>
              <CardDescription>Total Admins: {users.filter((u) => u.role === "admin").length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-4 py-3 text-left font-semibold">Username</th>
                      <th className="px-4 py-3 text-left font-semibold">Role</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Plan</th>
                      <th className="px-4 py-3 text-left font-semibold">Keys</th>
                      <th className="px-4 py-3 text-left font-semibold">Devices</th>
                      <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{user.username}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{user.plan.toUpperCase()}</td>
                        <td className="px-4 py-3 text-sm">{user.keys}</td>
                        <td className="px-4 py-3 text-sm">{user.devices}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {user.role !== "owner" && (
                              <>
                                <button
                                  onClick={() => handleUpgradePlan(user.id, user.username, user.plan)}
                                  className="px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors ripple-button"
                                  title="Change Plan"
                                >
                                  Change Plan
                                </button>
                                {user.role === "user" ? (
                                  <button
                                    onClick={() => handleMakeAdmin(user.id)}
                                    className="p-2 hover:bg-primary/10 text-primary rounded transition-colors ripple-button"
                                    title="Make Admin"
                                  >
                                    <Shield size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleRemoveAdmin(user.id)}
                                    className="p-2 hover:bg-yellow-100 text-yellow-700 dark:hover:bg-yellow-900/30 dark:text-yellow-400 rounded transition-colors ripple-button"
                                    title="Remove Admin"
                                  >
                                    <Shield size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleBlockUser(user.id)}
                                  className={`p-2 rounded transition-colors ripple-button ${
                                    user.status === "active"
                                      ? "hover:bg-destructive/10 text-destructive"
                                      : "hover:bg-green-100 text-green-700 dark:hover:bg-green-900/30 dark:text-green-400"
                                  }`}
                                  title={user.status === "active" ? "Block User" : "Unblock User"}
                                >
                                  {user.status === "active" ? <Lock size={16} /> : <Unlock size={16} />}
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors ripple-button"
                                  title="Delete User"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>© 2025 Made by Xyriel all rights reserved</p>
      </footer>
    </div>
  )
}
