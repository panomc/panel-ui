import { user } from "$lib/Store.js";
import { get } from "svelte/store";

export const Permissions = Object.freeze({
  ACCESS_PANEL: "access_panel",
  MANAGE_SERVERS: "manage_servers",
  MANAGE_POSTS: "manage_posts",
  MANAGE_TICKETS: "manage_tickets",
  MANAGE_PLAYERS: "manage_players",
  MANAGE_VIEW: "manage_view",
  MANAGE_ADDON: "manage_addon",
  MANAGE_PLATFORM_SETTINGS: "manage_platform_settings",
  MANAGE_PERMISSION_GROUPS: "manage_permission_groups"
});

export function hasPermission(permission) {
  const userObject = get(user)

  if (userObject.admin) {
    return true;
  }

  return userObject.permissions.includes(permission)
}