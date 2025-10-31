"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Send } from "lucide-react"
import { XYRIEL_CONFIG } from "@/lib/config"

interface PlatformChooserProps {
  isOpen: boolean
  onClose: () => void
  planName?: string
  action?: "subscribe" | "upgrade" | "add-balance"
  onPlatformSelected?: (platform: "discord" | "telegram") => void
}

export function PlatformChooserModal({
  isOpen,
  onClose,
  planName,
  action = "subscribe",
  onPlatformSelected,
}: PlatformChooserProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handlePlatformChoice = (platform: "discord" | "telegram") => {
    setIsLoading(true)
    const link = platform === "discord" ? XYRIEL_CONFIG.discordLink : XYRIEL_CONFIG.telegramLink

    if (onPlatformSelected) {
      onPlatformSelected(platform)
    }

    window.open(link, "_blank")
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-40" onClick={onClose} />
      <Card className="relative w-full max-w-md mx-4 bg-white dark:bg-slate-950 border-2 border-black/20 dark:border-white/20 shadow-2xl animate-in zoom-in duration-300 z-50">
        <CardHeader className="border-b border-border">
          <CardTitle>Choose a Platform</CardTitle>
          <CardDescription>
            Join our community on Discord or Telegram to{" "}
            {action === "subscribe" ? "subscribe" : action === "upgrade" ? "upgrade your plan" : "add balance"}
            {planName && ` to ${planName}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Button
            onClick={() => handlePlatformChoice("discord")}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 h-12 text-base relative overflow-hidden ripple-button"
          >
            <MessageCircle size={20} />
            Join Discord Server
          </Button>

          <Button
            onClick={() => handlePlatformChoice("telegram")}
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center gap-2 h-12 text-base relative overflow-hidden ripple-button"
          >
            <Send size={20} />
            Join Telegram Channel
          </Button>

          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full ripple-button bg-transparent"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
