"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XYRIEL_CONFIG } from "@/lib/config"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const [logoError, setLogoError] = useState(false)

  useEffect(() => {
    const remembered = localStorage.getItem("xyriel_remember")
    const savedUsername = localStorage.getItem("xyriel_username")
    if (remembered && savedUsername) {
      setUsername(savedUsername)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (username === XYRIEL_CONFIG.ownerUsername && password === XYRIEL_CONFIG.ownerPassword) {
        const sessionData = {
          userId: 1,
          username: XYRIEL_CONFIG.ownerUsername,
          role: "owner",
          plan: "premium",
          balance: 999999,
          email: "xyriel@panel.com",
          profileImage: null,
        }

        localStorage.setItem("xyriel_session", JSON.stringify(sessionData))

        if (rememberMe) {
          localStorage.setItem("xyriel_remember", "true")
          localStorage.setItem("xyriel_username", username)
        }

        router.push("/dashboard")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!username || !email || !password || !confirmPassword) {
        setError("All fields are required")
        setIsLoading(false)
        return
      }

      const existingUsers = JSON.parse(localStorage.getItem("xyriel_users") || "[]")
      if (existingUsers.some((u: any) => u.username.toLowerCase() === username.toLowerCase())) {
        setError("Username already taken. Please choose another.")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      const isOwner = username.toLowerCase() === "xyriel"

      const sessionData = {
        userId: Math.random(),
        username: username,
        role: isOwner ? "owner" : "user",
        plan: "free",
        balance: 0,
        email: email,
        profileImage: null,
      }

      localStorage.setItem("xyriel_session", JSON.stringify(sessionData))

      existingUsers.push({ username, email })
      localStorage.setItem("xyriel_users", JSON.stringify(existingUsers))

      if (rememberMe) {
        localStorage.setItem("xyriel_remember", "true")
        localStorage.setItem("xyriel_username", username)
      }

      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            {!logoError ? (
              <img
                src={XYRIEL_CONFIG.panelLogo || "/placeholder.svg"}
                alt="Panel Logo"
                onError={() => setLogoError(true)}
                className="w-12 h-12 rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
                X
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold">{XYRIEL_CONFIG.panelName}</h1>
          <p className="text-muted-foreground">{XYRIEL_CONFIG.panelDescription}</p>
        </div>

        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" className="ripple-button">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="register" className="ripple-button">
                Register
              </TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-4">
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Enter your credentials to access the panel</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="dark:border-border dark:focus:border-primary light:border-2 light:border-black light:focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="dark:border-border dark:focus:border-primary light:border-2 light:border-black light:focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-sm cursor-pointer">
                      Remember me
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 ripple-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register" className="space-y-4">
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Sign up to get started with {XYRIEL_CONFIG.panelName}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="dark:border-border dark:focus:border-primary light:border-2 light:border-black light:focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gmail</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="dark:border-border dark:focus:border-primary light:border-2 light:border-black light:focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="dark:border-border dark:focus:border-primary light:border-2 light:border-black light:focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="dark:border-border dark:focus:border-primary light:border-2 light:border-black light:focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember-register"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                    />
                    <label htmlFor="remember-register" className="text-sm cursor-pointer">
                      Remember me
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 ripple-button"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Register"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Demo: {XYRIEL_CONFIG.ownerUsername} / {XYRIEL_CONFIG.ownerPassword}
        </p>
      </div>
    </div>
  )
}
