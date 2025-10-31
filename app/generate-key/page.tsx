"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { SuccessModal } from "@/components/success-modal"
import { PlanLimitModal } from "@/components/plan-limit-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import { getUserKeyLimit, getUserDeviceLimit, isPlanExpired } from "@/lib/permissions"

export default function GenerateKeyPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [prefix, setPrefix] = useState("")
  const [numberOfKeys, setNumberOfKeys] = useState(1)
  const [expiryAmount, setExpiryAmount] = useState(30)
  const [expiryUnit, setExpiryUnit] = useState("days")
  const [maxDevices, setMaxDevices] = useState(1)
  const [generatedKeys, setGeneratedKeys] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPlanLimitModal, setShowPlanLimitModal] = useState(false)
  const [planLimitInfo, setPlanLimitInfo] = useState({
    currentKeysCount: 0,
    maxKeysAllowed: 3,
    maxDevicesAllowed: 100,
  })

  useEffect(() => {
    const sessionData = localStorage.getItem("xyriel_session")
    if (!sessionData) {
      router.push("/login")
    } else {
      const userData = JSON.parse(sessionData)
      setSession(userData)

      if (userData.planExpiryDate && isPlanExpired(new Date(userData.planExpiryDate))) {
        const updatedUser = { ...userData, plan: "free", planExpiryDate: null }
        localStorage.setItem("xyriel_session", JSON.stringify(updatedUser))
        setSession(updatedUser)
      }
    }
  }, [router])

  const generateRandomString = (length = 8) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const calculateExpiry = (amount: number, unit: string) => {
    if (unit === "lifetime") return "Lifetime"
    const date = new Date()
    switch (unit) {
      case "hours":
        date.setHours(date.getHours() + amount)
        break
      case "days":
        date.setDate(date.getDate() + amount)
        break
      case "weeks":
        date.setDate(date.getDate() + amount * 7)
        break
      case "months":
        date.setMonth(date.getMonth() + amount)
        break
      case "years":
        date.setFullYear(date.getFullYear() + amount)
        break
    }
    return date.toISOString().split("T")[0]
  }

  const handleGenerateKeys = () => {
    const keyLimit = getUserKeyLimit(session?.plan || "free")
    const deviceLimit = getUserDeviceLimit(session?.plan || "free")

    const existingKeys = localStorage.getItem("xyriel_keys")
    const keysList = existingKeys ? JSON.parse(existingKeys) : []
    const userKeys = keysList.filter((k: any) => k.createdBy === session?.username)

    if (userKeys.length + numberOfKeys > keyLimit && keyLimit !== Number.POSITIVE_INFINITY) {
      setPlanLimitInfo({
        currentKeysCount: userKeys.length,
        maxKeysAllowed: keyLimit,
        maxDevicesAllowed: deviceLimit,
      })
      setShowPlanLimitModal(true)
      return
    }

    if (maxDevices > deviceLimit && deviceLimit !== Number.POSITIVE_INFINITY) {
      alert(`Your plan allows maximum ${deviceLimit} devices per key.`)
      return
    }

    const keys: string[] = []
    const keyPrefix = prefix || session?.username || "KEY"

    for (let i = 0; i < numberOfKeys; i++) {
      const randomPart = generateRandomString(8)
      const newKey = `${keyPrefix}-${randomPart}`
      keys.push(newKey)

      keysList.push({
        id: Date.now() + Math.random(),
        createdBy: session?.username,
        key: newKey,
        expiry: calculateExpiry(expiryAmount, expiryUnit),
        status: "active",
        maxDevices: maxDevices,
        usedDevices: 0,
      })
    }

    localStorage.setItem("xyriel_keys", JSON.stringify(keysList))
    setGeneratedKeys(keys)
    setShowSuccess(true)
  }

  const copyToClipboard = (key: string, index: number) => {
    navigator.clipboard.writeText(key)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <SuccessModal isOpen={showSuccess} message="Generate Key Successful!" onClose={() => setShowSuccess(false)} />
      <PlanLimitModal
        isOpen={showPlanLimitModal}
        onClose={() => setShowPlanLimitModal(false)}
        currentKeysCount={planLimitInfo.currentKeysCount}
        maxKeysAllowed={planLimitInfo.maxKeysAllowed}
        maxDevicesAllowed={planLimitInfo.maxDevicesAllowed}
        userPlan={session?.plan || "free"}
      />

      <main className="pt-20 md:ml-64 p-4 md:p-6 scroll-smooth">
        <div className="space-y-6 max-w-2xl">
          <div>
            <h1 className="text-3xl font-bold">Generate New Key</h1>
            <p className="text-muted-foreground">Create new license keys for your users</p>
          </div>

          <Card className="border-2 border-black/20 dark:border-white/20 bg-card">
            <CardHeader>
              <CardTitle>Key Configuration</CardTitle>
              <CardDescription>Set up your license key parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Key Prefix (Optional)</label>
                <Input
                  placeholder={`e.g., ${session?.username || "XYRIEL"}`}
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="mt-1 border-2 border-border"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use your username: {session?.username}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Number of Keys</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={numberOfKeys}
                    onChange={(e) => setNumberOfKeys(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="mt-1 border-2 border-border"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Expiry Duration</label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="number"
                      min="1"
                      max="8760000"
                      value={expiryAmount}
                      onChange={(e) => setExpiryAmount(Number.parseInt(e.target.value) || 1)}
                      placeholder="Amount"
                      className="flex-1 border-2 border-border"
                    />
                    <select
                      value={expiryUnit}
                      onChange={(e) => setExpiryUnit(e.target.value)}
                      className="px-3 py-2 border-2 border-border rounded-lg bg-background"
                    >
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                      <option value="lifetime">Lifetime</option>
                    </select>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Min: 1 hour | Max: 1000 years</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Max Devices</label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={maxDevices}
                    onChange={(e) => setMaxDevices(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="mt-1 border-2 border-border"
                  />
                </div>
              </div>

              <Button onClick={handleGenerateKeys} className="w-full bg-primary hover:bg-primary/90 ripple-button h-10">
                Generate Key{numberOfKeys > 1 ? "s" : ""}
              </Button>
            </CardContent>
          </Card>

          {generatedKeys.length > 0 && (
            <Card className="border-2 border-black/20 dark:border-white/20 bg-muted/50">
              <CardHeader>
                <CardTitle>Generated Keys</CardTitle>
                <CardDescription>Copy your new license keys below</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generatedKeys.map((key, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-card rounded-lg border-2 border-border dark:border-white/20"
                    >
                      <code className="font-mono text-sm break-all">{key}</code>
                      <button
                        onClick={() => copyToClipboard(key, index)}
                        className="p-2 hover:bg-muted rounded transition-colors flex-shrink-0 ml-2 ripple-button"
                      >
                        {copiedIndex === index ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
