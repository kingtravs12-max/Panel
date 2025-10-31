"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

interface Plan {
  name: string
  price_php: string
  price_usd: string
  keys: string | number
  devices: string | number
  features: {
    name: string
    free: boolean
    trial3d: boolean
    trial7d: boolean
    trial14d: boolean
    trial30d: boolean
    unlimited: boolean
  }[]
}

export default function PlansPage() {
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

  const plans: Plan[] = [
    {
      name: "Free",
      price_php: "0.0 ₱",
      price_usd: "$0.0 USD",
      keys: 3,
      devices: 100,
      features: [
        {
          name: "Total Keys",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Total Devices",
          free: false,
          trial3d: false,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Priority Support",
          free: false,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Key Renewal",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Devices Security",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Bypass Key Generation Cooldown",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Automatic Key Renewal",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: false,
          trial30d: true,
          unlimited: true,
        },
      ],
    },
    {
      name: "3 Days Trial",
      price_php: "50 ₱",
      price_usd: "$6 USD",
      keys: 10,
      devices: 300,
      features: [
        {
          name: "Total Keys",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Total Devices",
          free: false,
          trial3d: false,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Priority Support",
          free: false,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Key Renewal",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Devices Security",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Bypass Key Generation Cooldown",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Automatic Key Renewal",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: false,
          trial30d: true,
          unlimited: true,
        },
      ],
    },
    {
      name: "7 Days Trial",
      price_php: "150 ₱",
      price_usd: "$15 USD",
      keys: 20,
      devices: 700,
      features: [
        {
          name: "Total Keys",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Total Devices",
          free: false,
          trial3d: false,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Priority Support",
          free: false,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Key Renewal",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Devices Security",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Bypass Key Generation Cooldown",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Automatic Key Renewal",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: false,
          trial30d: true,
          unlimited: true,
        },
      ],
    },
    {
      name: "14 Days Trial",
      price_php: "450 ₱",
      price_usd: "$20 USD",
      keys: 40,
      devices: "Unlimited",
      features: [
        {
          name: "Total Keys",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Total Devices",
          free: false,
          trial3d: false,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Priority Support",
          free: false,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Key Renewal",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Devices Security",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Bypass Key Generation Cooldown",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Automatic Key Renewal",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: false,
          trial30d: true,
          unlimited: true,
        },
      ],
    },
    {
      name: "30 Days Trial",
      price_php: "700 ₱",
      price_usd: "$35 USD",
      keys: "Unlimited",
      devices: "Unlimited",
      features: [
        {
          name: "Total Keys",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Total Devices",
          free: false,
          trial3d: false,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Priority Support",
          free: false,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Key Renewal",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Devices Security",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Bypass Key Generation Cooldown",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Automatic Key Renewal",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: false,
          trial30d: true,
          unlimited: true,
        },
      ],
    },
    {
      name: "Lifetime",
      price_php: "1,200 ₱",
      price_usd: "$50 USD",
      keys: "Unlimited",
      devices: "Unlimited",
      features: [
        {
          name: "Total Keys",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Total Devices",
          free: false,
          trial3d: false,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Priority Support",
          free: false,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Key Renewal",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Devices Security",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Bypass Key Generation Cooldown",
          free: true,
          trial3d: true,
          trial7d: true,
          trial14d: true,
          trial30d: true,
          unlimited: true,
        },
        {
          name: "Automatic Key Renewal",
          free: false,
          trial3d: false,
          trial7d: false,
          trial14d: false,
          trial30d: true,
          unlimited: true,
        },
      ],
    },
  ]

  if (!session) return null

  const planColumns = [
    { key: "free", label: "Free" },
    { key: "trial3d", label: "3d" },
    { key: "trial7d", label: "7d" },
    { key: "trial14d", label: "14d" },
    { key: "trial30d", label: "30d" },
    { key: "unlimited", label: "Unlimited" },
  ]

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="pt-20 md:ml-64 p-4 md:p-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Plans Comparison</h1>
            <p className="text-muted-foreground">Compare all available plans and choose the best one for you</p>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border-2 border-black/20 rounded-lg bg-card">
            <table className="w-full">
              <thead className="bg-muted/50 border-b-2 border-border">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Plan</th>
                  <th className="px-6 py-4 text-center font-bold">Price PHP</th>
                  <th className="px-6 py-4 text-center font-bold">Price USD</th>
                  <th className="px-6 py-4 text-center font-bold">Keys</th>
                  <th className="px-6 py-4 text-center font-bold">Devices</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold">{plan.name}</td>
                    <td className="px-6 py-4 text-center text-primary font-bold">{plan.price_php}</td>
                    <td className="px-6 py-4 text-center text-primary font-bold">{plan.price_usd}</td>
                    <td className="px-6 py-4 text-center">{plan.keys}</td>
                    <td className="px-6 py-4 text-center">{plan.devices}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {plans.map((plan, idx) => (
              <Card key={idx} className="border-2 border-black/20 bg-muted/20">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="space-y-1">
                    <div className="text-primary font-bold">{plan.price_php}</div>
                    <div className="text-sm">{plan.price_usd}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Keys:</span>
                    <span className="font-semibold">{plan.keys}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Devices:</span>
                    <span className="font-semibold">{plan.devices}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Perks Comparison Table */}
          <Card className="border-2 border-black/20 bg-card">
            <CardHeader>
              <CardTitle>Features & Perks</CardTitle>
              <CardDescription>Detailed comparison of all plan features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b-2 border-border">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Feature</th>
                      {planColumns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-center font-bold whitespace-nowrap">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plans[0].features.map((feature, featureIdx) => (
                      <tr key={featureIdx} className="border-b border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{feature.name}</td>
                        <td className="px-4 py-3 text-center">
                          {feature.free ? (
                            <Check size={20} className="mx-auto text-green-600" />
                          ) : (
                            <X size={20} className="mx-auto text-gray-300" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.trial3d ? (
                            <Check size={20} className="mx-auto text-green-600" />
                          ) : (
                            <X size={20} className="mx-auto text-gray-300" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.trial7d ? (
                            <Check size={20} className="mx-auto text-green-600" />
                          ) : (
                            <X size={20} className="mx-auto text-gray-300" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.trial14d ? (
                            <Check size={20} className="mx-auto text-green-600" />
                          ) : (
                            <X size={20} className="mx-auto text-gray-300" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.trial30d ? (
                            <Check size={20} className="mx-auto text-green-600" />
                          ) : (
                            <X size={20} className="mx-auto text-gray-300" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.unlimited ? (
                            <Check size={20} className="mx-auto text-green-600" />
                          ) : (
                            <X size={20} className="mx-auto text-gray-300" />
                          )}
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
    </div>
  )
}
