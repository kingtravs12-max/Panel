"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

interface PlanLimitModalProps {
  isOpen: boolean
  onClose: () => void
  currentKeysCount: number
  maxKeysAllowed: number
  maxDevicesAllowed: number
  userPlan: string
}

export function PlanLimitModal({
  isOpen,
  onClose,
  currentKeysCount,
  maxKeysAllowed,
  maxDevicesAllowed,
  userPlan,
}: PlanLimitModalProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push("/subscriptions")
    onClose()
  }

  if (!isOpen) return null

  const keysRemaining = maxKeysAllowed - currentKeysCount
  const isUnlimited = maxKeysAllowed === Number.POSITIVE_INFINITY

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" onClick={onClose} />

      <Card className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-900 border-2 border-black/20 dark:border-white/30 shadow-2xl animate-in zoom-in duration-300 z-50">
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400" size={24} />
            <CardTitle className="text-lg">Plan Limit Reached</CardTitle>
          </div>
          <CardDescription className="text-sm">You've reached your plan's key generation limit</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3 bg-muted/50 dark:bg-slate-800 p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Plan:</span>
              <span className="font-semibold capitalize text-foreground">{userPlan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Keys Created:</span>
              <span className="font-semibold text-foreground">
                {currentKeysCount}/{isUnlimited ? "∞" : maxKeysAllowed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Device Limit per Key:</span>
              <span className="font-semibold text-foreground">
                {maxDevicesAllowed === Number.POSITIVE_INFINITY ? "Unlimited" : maxDevicesAllowed}
              </span>
            </div>
            {!isUnlimited && keysRemaining > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-sm font-medium">Keys Remaining:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{keysRemaining}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-foreground">
              {isUnlimited
                ? "You have unlimited keys on this plan."
                : `You can only create ${maxKeysAllowed} keys total on your ${userPlan} plan.`}
            </p>
            <p className="text-sm text-muted-foreground">
              Upgrade your plan to generate more keys and access additional features.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleUpgrade}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white ripple-button h-10"
            >
              UPGRADE
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 ripple-button h-10 bg-white dark:bg-slate-800 border-2 border-border"
            >
              No thanks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
