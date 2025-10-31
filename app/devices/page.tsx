"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Clock } from "lucide-react"

interface Device {
  id: number
  owner: string
  name: string
  keyId: string
  lastSeen: string
  createdAt: string
}

export default function DevicesPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      owner: "Xyriel",
      name: "Windows PC",
      keyId: "XYRIEL-5396B26C",
      lastSeen: "2 minutes ago",
      createdAt: "2025-10-27",
    },
    {
      id: 2,
      owner: "Xyriel",
      name: "MacBook Pro",
      keyId: "XYRIEL-9439FCF4",
      lastSeen: "1 hour ago",
      createdAt: "2025-10-26",
    },
    {
      id: 3,
      owner: "Xyriel",
      name: "Linux Server",
      keyId: "XYRIEL-FC52E1FD",
      lastSeen: "3 days ago",
      createdAt: "2025-10-20",
    },
  ])

  useEffect(() => {
    const sessionData = localStorage.getItem("xyriel_session")
    if (!sessionData) {
      router.push("/login")
    } else {
      setSession(JSON.parse(sessionData))
    }
  }, [router])

  const userDevices = devices.filter((device) => device.owner === session?.username)

  const handleRemoveDevice = (deviceId: number) => {
    if (confirm("Are you sure you want to remove this device?")) {
      setDevices(devices.filter((device) => device.id !== deviceId))
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
            <h1 className="text-3xl font-bold">Your Connected Devices</h1>
            <p className="text-muted-foreground">Manage devices connected to your license keys</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
              🛡️ Your clients' devices are protected by <strong>ARC</strong> & <strong>KASPERSKY</strong> &{" "}
              <strong>ARISTOTLE</strong>
            </p>
          </div>

          <Card className="border-2 border-black/20 bg-card">
            <CardHeader>
              <CardTitle>Your Devices</CardTitle>
              <CardDescription>Total devices: {userDevices.length}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userDevices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 border-2 border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{device.name}</p>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Key: {device.keyId}</span>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>Last seen: {device.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveDevice(device.id)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors ripple-button"
                      title="Remove Device"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              {userDevices.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No devices connected yet.</div>
              )}
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
