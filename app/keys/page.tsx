"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit2, Trash2 } from "lucide-react"

interface LicenseKey {
  id: number
  createdBy: string
  key: string
  expiry: string
  status: "active" | "expired" | "max_devices"
  maxDevices: number
  usedDevices: number
}

export default function KeysPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showUnused, setShowUnused] = useState(false)
  const [keys, setKeys] = useState<LicenseKey[]>([])
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<number | null>(null)

  useEffect(() => {
    const sessionData = localStorage.getItem("xyriel_session")
    if (!sessionData) {
      router.push("/login")
    } else {
      setSession(JSON.parse(sessionData))
    }

    const loadKeys = () => {
      const savedKeys = localStorage.getItem("xyriel_keys")
      if (savedKeys) {
        const parsedKeys = JSON.parse(savedKeys)
        setKeys(parsedKeys)
      }
    }

    loadKeys()

    const handleStorageChange = () => {
      loadKeys()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [router])

  const filteredKeys = keys.filter((key) => {
    const isOwnedByUser = key.createdBy === session?.username
    const matchesSearch = key.key.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUnused = !showUnused || key.usedDevices === 0
    return isOwnedByUser && matchesSearch && matchesUnused
  })

  const handleDeleteKey = (keyId: number) => {
    setShowDeleteWarning(true)
    setKeyToDelete(keyId)
  }

  const confirmDeleteKey = () => {
    if (keyToDelete) {
      const updatedKeys = keys.filter((k) => k.id !== keyToDelete)
      setKeys(updatedKeys)
      localStorage.setItem("xyriel_keys", JSON.stringify(updatedKeys))
      setShowDeleteWarning(false)
      setKeyToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "expired":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "max_devices":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "ACTIVE"
      case "expired":
        return "EXPIRED"
      case "max_devices":
        return "MAXED"
      default:
        return status
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-64 p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Your License Keys</h1>
            <p className="text-muted-foreground">View and manage your created license keys</p>
          </div>

          <Card className="border-2 border-black/20 dark:border-white/20 bg-card">
            <CardHeader>
              <CardTitle>Your Keys</CardTitle>
              <CardDescription>License keys you created ({filteredKeys.length})</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    placeholder="Search keys..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-2 border-border"
                  />
                </div>
                <Button
                  variant={showUnused ? "default" : "outline"}
                  onClick={() => setShowUnused(!showUnused)}
                  className="ripple-button"
                >
                  {showUnused ? "Show All" : "Unused Only"}
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-border bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Key</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Expiry</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Device Connected</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeys.map((key) => (
                      <tr key={key.id} className="border-b border-border hover:bg-muted/50">
                        <td className="px-4 py-3 font-mono text-sm text-primary">{key.key}</td>
                        <td className="px-4 py-3 text-sm">{key.expiry}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(key.status)}`}
                          >
                            {getStatusLabel(key.status)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {key.usedDevices}/{key.maxDevices}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded transition-colors ripple-button">
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteKey(key.id)}
                              className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors ripple-button"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredKeys.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No keys found. {searchTerm && "Try adjusting your search."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {showDeleteWarning && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteWarning(false)} />
          <Card className="relative w-full max-w-md mx-4 border-2 border-black/20 dark:border-white/20">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Warning!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">The key will be removed permanently. Are you sure you want to delete this key?</p>
              <div className="flex gap-2">
                <button
                  onClick={confirmDeleteKey}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors ripple-button font-medium"
                >
                  YES
                </button>
                <button
                  onClick={() => setShowDeleteWarning(false)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition-colors ripple-button font-medium"
                >
                  CANCEL
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>© 2025 Made by Xyriel all rights reserved</p>
      </footer>
    </div>
  )
}
