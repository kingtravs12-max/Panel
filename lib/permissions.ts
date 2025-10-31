import { planConfig } from "./config"

export interface UserPlan {
  planType: string
  assignedDate: Date
  expiryDate: Date | null
}

export function getUserKeyLimit(plan: string): number {
  const planData = planConfig[plan as keyof typeof planConfig]
  return planData?.maxKeys ?? 3
}

export function getUserDeviceLimit(plan: string): number {
  const planData = planConfig[plan as keyof typeof planConfig]
  return planData?.maxDevices ?? 100
}

export function getPlanExpiryDate(plan: string): Date | null {
  const planData = planConfig[plan as keyof typeof planConfig]
  if (!planData?.expiryDays) return null

  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + planData.expiryDays)
  return expiryDate
}

export function isPlanExpired(expiryDate: Date | null): boolean {
  if (!expiryDate) return false
  return new Date() > expiryDate
}

export function getDaysUntilExpiry(expiryDate: Date | null): number | null {
  if (!expiryDate) return null
  const today = new Date()
  const timeDiff = expiryDate.getTime() - today.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}
