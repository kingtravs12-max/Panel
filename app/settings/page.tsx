"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Copy, Eye, EyeOff, Send } from "lucide-react"

interface CommunityModal {
  isOpen: boolean
  type: "discord" | "telegram" | null
}

export default function SettingsPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [communityModal, setCommunityModal] = useState<CommunityModal>({ isOpen: false, type: null })

  useEffect(() => {
    const sessionData = localStorage.getItem("xyriel_session")
    if (!sessionData) {
      router.push("/login")
    } else {
      const data = JSON.parse(sessionData)
      setSession(data)
      setEmail(data.email)
      setProfileImage(data.profileImage)
    }
  }, [router])

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    alert("Password changed successfully")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleCommunityClick = (type: "discord" | "telegram") => {
    setCommunityModal({ isOpen: true, type })
  }

  const closeCommunityModal = () => {
    setCommunityModal({ isOpen: false, type: null })
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.match(/image\/(jpg|jpeg|png)/)) {
        alert("Only JPG and PNG files are allowed")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        setProfileImage(imageData)

        const updatedSession = { ...session, profileImage: imageData }
        setSession(updatedSession)
        localStorage.setItem("xyriel_session", JSON.stringify(updatedSession))
        alert("Profile picture updated successfully!")
      }
      reader.readAsDataURL(file)
    }
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {communityModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/50" onClick={closeCommunityModal} />
          <Card className="relative w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Join Community to Add Balance</CardTitle>
              <CardDescription>Choose a platform to join and upgrade your plan or add balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You selected {communityModal.type === "discord" ? "Discord" : "Telegram"}. Please join the community
                first, then you can upgrade your plan or add balance.
              </p>
              <div className="flex gap-2">
                <a
                  href={communityModal.type === "discord" ? "https://discord.gg/xyriel" : "https://t.me/xyriel"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full">Open {communityModal.type === "discord" ? "Discord" : "Telegram"}</Button>
                </a>
                <Button variant="outline" onClick={closeCommunityModal} className="flex-1 bg-transparent">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="pt-20 md:ml-64 p-4 md:p-6">
        <div className="space-y-6 max-w-2xl">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-2xl">
                  {profileImage ? (
                    <img
                      src={profileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    session.username.charAt(0).toUpperCase()
                  )}
                </div>
                <label className="cursor-pointer ripple-button">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                  <Button variant="outline" className="gap-2 bg-transparent cursor-pointer" asChild>
                    <span>
                      <Upload size={18} />
                      Upload Picture
                    </span>
                  </Button>
                </label>
              </div>

              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  placeholder="your.email@example.com"
                  className="mt-1 border-2 border-border bg-muted/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed after registration</p>
              </div>

              <div>
                <label className="text-sm font-medium">Username</label>
                <Input value={session.username} disabled className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Role</label>
                <Input value={session.role.toUpperCase()} disabled className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Plan</label>
                <Input value={session.plan.toUpperCase()} disabled className="mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Balance</label>
                <div className="flex gap-2 mt-1">
                  <Input value={`$${session.balance}`} disabled className="flex-1" />
                  <Button
                    variant="outline"
                    onClick={() => handleCommunityClick("discord")}
                    className="whitespace-nowrap"
                  >
                    Add Balance
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Join Discord or Telegram to add balance or upgrade your plan
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Credentials Section */}
          <Card>
            <CardHeader>
              <CardTitle>Credentials</CardTitle>
              <CardDescription>Your account credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Username</p>
                    <p className="font-mono text-sm">{session.username}</p>
                  </div>
                  <button className="p-2 hover:bg-background rounded transition-colors">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">New Password</label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button onClick={handlePasswordChange} className="w-full bg-primary hover:bg-primary/90">
                Update Password
              </Button>
            </CardContent>
          </Card>

          {/* Community Section */}
          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
              <CardDescription>Join our community channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={() => handleCommunityClick("discord")}
                className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  D
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Discord Server</p>
                  <p className="text-sm text-muted-foreground">Join our Discord community</p>
                </div>
                <Send size={18} className="text-muted-foreground flex-shrink-0" />
              </button>

              <button
                onClick={() => handleCommunityClick("telegram")}
                className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  T
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Telegram Channel</p>
                  <p className="text-sm text-muted-foreground">Follow us on Telegram</p>
                </div>
                <Send size={18} className="text-muted-foreground flex-shrink-0" />
              </button>
            </CardContent>
          </Card>

          {/* Subscription Status Section */}
          <Card className="border-2 border-black/20 dark:border-white/20">
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>Your current plan and expiry information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current Plan:</span>
                  <span className="font-semibold">{session?.plan?.toUpperCase() || "FREE"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Plan Status:</span>
                  {session?.plan === "lifetime" ? (
                    <span className="text-lg">∞ Lifetime</span>
                  ) : session?.planExpiryDate ? (
                    <span className="font-semibold">{new Date(session.planExpiryDate).toLocaleDateString()}</span>
                  ) : (
                    <span className="font-semibold">No Expiry</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
