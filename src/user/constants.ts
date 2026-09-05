// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/user/constants.ts — THE DROPDOWN MENU, AS DATA
// ═══════════════════════════════════════════════════════════════════════════
// Defines every entry of the user dropdown (avatar menu, top-right).
// Same "menu as data" pattern as NavBar/constants.ts:
//   name          → the label shown
//   to            → Wasp route constant (type-safe URL)
//   icon          → the lucide-react icon component
//   isAuthRequired→ "only show when logged in"
//   isAdminOnly   → "only show to admins" (UserMenuItems filters on this)
//
// 📌 ECO PULSE:
//   - "AI Scheduler" → replace with "Feed" (routes.FeedRoute.to — your page)
//   - "Admin Dashboard" → rename "Officer Dashboard"; guard it with
//     isOfficerOnly instead of isAdminOnly (or keep isAdminOnly and treat
//     admin == officer for now).
//   - The AdminRoute it points to comes from src/admin — keep that module
//     (it becomes your officer panel).
// ═══════════════════════════════════════════════════════════════════════════
import { LayoutDashboard, Settings, Shield } from "lucide-react"; // 🔥 swap icons later
import { routes } from "wasp/client/router";

export const userMenuItems = [
  {
    name: "Feed", // 🔥 → "Feed" / links to FeedRoute
    to: routes.FeedRoute.to, // 🔥 → routes.FeedRoute.to
    icon: LayoutDashboard,
    isAdminOnly: false,
    isAuthRequired: true,
  },
  {
    name: "Account Settings", // KEEP — the account page is yours
    to: routes.AccountRoute.to,
    icon: Settings,
    isAuthRequired: false,
    isAdminOnly: false,
  },
  {
    name: "Admin Dashboard", // 🔥 → "Officer Dashboard" (guard by isOfficer)
    to: routes.AdminRoute.to,
    icon: Shield,
    isAuthRequired: false,
    isAdminOnly: true,
  },
] as const;