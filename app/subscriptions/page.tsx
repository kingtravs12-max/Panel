"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { PlatformChooserModal } from "@/components/platform-chooser-modal"

interface SubscriptionPlan {
  id: string
  name: string
  duration: string
  price_php: string
  price_usd: string
  description: string
  features: string[]
  isPopular?: boolean
  type: "trial" | "permanent"
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [showPlatformModal, setShowPlatformModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>("")

  useEffect(() => {
    const sessionData = localStorage.getItem("xyriel_session")
    if (!sessionData) {
      router.push("/login")
    } else {
      setSession(JSON.parse(sessionData))
    }
  }, [router])

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "free",
      name: "Free Plan",
      duration: "Forever",
      price_php: "0 ₱",
      price_usd: "$0 USD",
      description: "Perfect for getting started",
      type: "trial",
      features: ["3 total keys", "100 total devices", "Community support", "Basic features"],
    },
    {
      id: "trial-3days",
      name: "Premium Trial",
      duration: "3 Days",
      price_php: "50 ₱",
      price_usd: "$6 USD",
      description: "Try premium features",
      type: "trial",
      features: ["10 total keys", "300 total devices", "Priority support", "All premium features"],
    },
    {
      id: "trial-7days",
      name: "Premium Trial",
      duration: "7 Days",
      price_php: "150 ₱",
      price_usd: "$15 USD",
      description: "Extended trial period",
      type: "trial",
      features: ["20 total keys", "700 total devices", "Priority support", "All premium features"],
      isPopular: true,
    },
    {
      id: "trial-14days",
      name: "Premium Trial",
      duration: "14 Days",
      price_php: "450 ₱",
      price_usd: "$20 USD",
      description: "Full trial experience",
      type: "trial",
      features: ["40 total keys", "Unlimited devices", "Priority support", "All premium features"],
    },
    {
      id: "trial-30days",
      name: "Premium Trial",
      duration: "30 Days",
      price_php: "700 ₱",
      price_usd: "$35 USD",
      description: "Full month trial",
      type: "trial",
      features: ["Unlimited keys", "Unlimited devices", "Priority support", "All premium features"],
    },
    {
      id: "lifetime",
      name: "Premium Lifetime",
      duration: "Forever",
      price_php: "1,200 ₱",
      price_usd: "$50 USD",
      description: "Lifetime premium access",
      type: "permanent",
      features: ["Unlimited keys", "Unlimited devices", "24/7 priority support", "Exclusive features"],
    },
  ]

  const handleSubscribe = (planId: string) => {
    if (planId === "free") {
      if (session?.plan !== "free") {
        alert("You already have a premium plan")
        return
      }
      alert("You already have the free plan")
      return
    }

    if (session?.plan !== "free" && planId !== "free") {
      alert("You already have a premium plan. Contact support to change it.")
      return
    }

    setSelectedPlan(planId)
    setShowPlatformModal(true)
  }

  const trialPlans = subscriptionPlans.filter((p) => p.type === "trial" && p.id !== "free")
  const permanentPlans = subscriptionPlans.filter((p) => p.type === "permanent")
  const freePlan = subscriptionPlans.find((p) => p.id === "free")

  if (!session) return null

  return (
    <div className="min-h-screen bg-background scroll-smooth">
      <Header onMenuToggle={setIsSidebarOpen} isSidebarOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <PlatformChooserModal
        isOpen={showPlatformModal}
        onClose={() => setShowPlatformModal(false)}
        planName={subscriptionPlans.find((p) => p.id === selectedPlan)?.name}
        action="subscribe"
      />

      <main className="pt-20 md:ml-64 p-4 md:p-6">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Subscriptions & Plans</h1>
            <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
          </div>

          {freePlan && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
                <p className="text-muted-foreground mb-4">Start with our free tier, no credit card required</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card className="border-2 border-black/20 bg-card">
                  <CardHeader>
                    <CardTitle>{freePlan.name}</CardTitle>
                    <CardDescription>{freePlan.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold dark:text-white light:text-black">{freePlan.price_php}</div>
                      <div className="text-sm text-muted-foreground dark:text-gray-300 light:text-gray-600">
                        {freePlan.price_usd}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{freePlan.description}</p>

                    <ul className="space-y-2">
                      {freePlan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={16} className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(freePlan.id)}
                      disabled={session?.plan === "free"}
                      className="w-full bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white py-2 rounded-lg transition-colors ripple-button"
                    >
                      {session?.plan === "free" ? "Current Plan" : "Get Free"}
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Trial Plans Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Trial Subscriptions</h2>
              <p className="text-muted-foreground mb-4">Experience premium features with our flexible trial options</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trialPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`border-2 border-black/20 relative flex flex-col bg-muted/20 ${
                    plan.isPopular ? "ring-2 ring-primary md:scale-105 bg-card" : ""
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className={plan.isPopular ? "pt-8" : ""}>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold dark:text-white light:text-black">{plan.price_php}</div>
                      <div className="text-sm text-muted-foreground dark:text-gray-300 light:text-gray-600">
                        {plan.price_usd}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{plan.description}</p>

                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={16} className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      className={`w-full py-2 rounded-lg transition-colors ripple-button text-white font-medium ${
                        plan.isPopular ? "bg-primary hover:bg-primary/90" : "bg-primary/50 hover:bg-primary/60"
                      }`}
                    >
                      Subscribe Now
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Permanent Subscription Section */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Permanent Subscription</h2>
              <p className="text-muted-foreground mb-4">Get lifetime access to premium features</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {permanentPlans.map((plan) => (
                <Card key={plan.id} className="border-2 border-black/20 flex flex-col ring-2 ring-primary bg-card">
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>Lifetime Access</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-6">
                    <div className="space-y-1">
                      <div className="text-4xl font-bold dark:text-white light:text-black">{plan.price_php}</div>
                      <div className="text-sm text-muted-foreground dark:text-gray-300 light:text-gray-600">
                        {plan.price_usd}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{plan.description}</p>

                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check size={16} className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded-lg transition-colors ripple-button font-medium"
                    >
                      Get Lifetime Access
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>© 2025 Made by Xyriel all rights reserved</p>
      </footer>
    </div>
  )
}
