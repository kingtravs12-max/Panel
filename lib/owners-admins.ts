export const PANEL_ROLES = {
  // Owner - full control
  owner: "Xyriel pogi",

  // Admins - can manage users and keys
  admins: [
    // Add admin usernames here
    // Example: "admin_username",
  ],
}

export function isOwner(username: string): boolean {
  return username === PANEL_ROLES.owner
}

export function isAdmin(username: string): boolean {
  return PANEL_ROLES.admins.includes(username) || isOwner(username)
}
