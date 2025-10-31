export const XYRIEL_CONFIG = {
  // Panel branding
  panelLogo: "/logo.png", // Place PNG or JPG in public folder
  panelName: "Xyriel Panel",
  panelDescription: "Professional Admin Dashboard",

  // Community links
  discordLink: "https://discord.gg/xyriel",
  telegramLink: "https://t.me/xyriel",

  // Owner credentials
  ownerUsername: "Xyriel pogi",
  ownerPassword: "Xyriel123",

  // Owner & Admins - easily configurable
  roleConfig: {
    owner: "Xyriel pogi", // Main owner
    admins: [
      // Add admin usernames here - they will have admin privileges
      // Example: "admin_username",
    ],
  },

  // Plan configuration with key and device limits
  planConfig: {
    free: {
      maxKeys: 3,
      maxDevices: 100,
      expiryDays: null,
      name: "Free",
    },
    "premium-3d": {
      maxKeys: 10,
      maxDevices: 300,
      expiryDays: 3,
      name: "Premium (3 Days)",
    },
    "premium-7d": {
      maxKeys: 20,
      maxDevices: 700,
      expiryDays: 7,
      name: "Premium (7 Days)",
    },
    "premium-14d": {
      maxKeys: 40,
      maxDevices: Number.POSITIVE_INFINITY,
      expiryDays: 14,
      name: "Premium (14 Days)",
    },
    "premium-30d": {
      maxKeys: Number.POSITIVE_INFINITY,
      maxDevices: Number.POSITIVE_INFINITY,
      expiryDays: 30,
      name: "Premium (30 Days)",
    },
    lifetime: {
      maxKeys: Number.POSITIVE_INFINITY,
      maxDevices: Number.POSITIVE_INFINITY,
      expiryDays: null,
      name: "Premium (Lifetime)",
    },
  },
}

export const planConfig = XYRIEL_CONFIG.planConfig

export function isOwner(username: string): boolean {
  return username === XYRIEL_CONFIG.roleConfig.owner
}

export function isAdmin(username: string): boolean {
  return XYRIEL_CONFIG.roleConfig.admins.includes(username) || isOwner(username)
}
