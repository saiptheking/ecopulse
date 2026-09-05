// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/user/UserMenuItems.tsx — THE MOBILE NAVBAR MENU
// ═══════════════════════════════════════════════════════════════════════════
// Same menu items as UserDropdown, but as <li> items for the mobile
// hamburger menu (NavBarMobileMenu maps over them). Notice the split:
// desktop shows a POPOVER (UserDropdown), mobile shows a LIST (this file).
// Same data, two presentations. This is classic React component design:
// extract what's the same (the items + guards), vary what's different
// (the container), pass the difference via PROPS.
//
// Props here: user (who's logged in), onItemClick (callback the parent
// passes so the menu can close when a link is tapped — props = how
// components talk to each other).
//
// ECO PULSE: keep both as-is; they just render constants.ts.
// ═══════════════════════════════════════════════════════════════════════════
import { LogOut } from "lucide-react";
import { logout } from "wasp/client/auth";
import { Link as WaspRouterLink } from "wasp/client/router";
import { type User } from "wasp/entities";
import { userMenuItems } from "./constants";

export function UserMenuItems({
  user,
  onItemClick, // ← prop: a function the parent gives us to call on click
}: {
  user?: Partial<User>;
  onItemClick?: () => void;
}) {
  return (
    <>
      {userMenuItems.map((item) => {
        // Same guards as the desktop dropdown:
        if (item.isAuthRequired && !user) return null;
        if (item.isAdminOnly && (!user || !user.isAdmin)) return null;

        return (
          <li key={item.name}>
            <WaspRouterLink
              to={item.to}
              onClick={onItemClick} // ← call the parent's close-menu callback
              className="text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium leading-7 transition-colors"
            >
              <item.icon size="1.1rem" />
              {item.name}
            </WaspRouterLink>
          </li>
        );
      })}
      <li>
        <button
          onClick={() => {
            logout();
            onItemClick?.();
          }}
          className="text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium leading-7 transition-colors"
        >
          <LogOut size="1.1rem" />
          Log Out
        </button>
      </li>
    </>
  );
}