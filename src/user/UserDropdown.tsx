// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/user/UserDropdown.tsx — THE AVATAR DROPDOWN (desktop navbar)
// ═══════════════════════════════════════════════════════════════════════════
// Two React concepts on display:
//
//   useState(open) — UI state. The dropdown knows if it's open or closed;
//     clicking the trigger flips it. This is the SAME useState you learned
//     in your React lessons. State = "things that change and must re-render".
//
//   .map() list rendering — userMenuItems.map(item => <MenuItem/>) turns the
//     menu DATA into menu UI. One item per array entry, keyed by item.name.
//     This is exactly how you'll render your Eco Pulse challenge cards:
//       challenges.map(c => <ChallengeCard key={c.id} challenge={c} />)
//
//   FILTERING GUARDS: `if (item.isAuthRequired && !user) return null;`
//     — "not logged in? hide this item." `item.isAdminOnly` — "not an admin?
//     hide it." Ask-yourself question for Eco Pulse: how do you hide the
//     Officer Panel from regular members? Same pattern with isOfficer.
//
// THE logout(): Wasp's generated auth function — clears the session
// cookie. Call it from any click handler; no fetch code needed.
// ═══════════════════════════════════════════════════════════════════════════
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { logout } from "wasp/client/auth";
import { Link as WaspRouterLink } from "wasp/client/router";
import { type User as UserEntity } from "wasp/entities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../client/components/ui/dropdown-menu";
import { userMenuItems } from "./constants";

export function UserDropdown({ user }: { user: Partial<UserEntity> }) {
  const [open, setOpen] = useState(false); // ← UI state: dropdown open?

  return (
    // shadcn/ui dropdown, wired to our `open` state:
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className="text-foreground hover:text-primary flex items-center transition-colors duration-300 ease-in-out">
          <span className="text-foreground mr-2 hidden text-right text-sm font-medium lg:block">
            {user.name} {/* shows the logged-in username */}
          </span>
          <User className="size-5" />
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* THE map() + filter pattern — this is the React-skill core */}
        {userMenuItems.map((item) => {
          if (item.isAuthRequired && !user) return null; // logged out → hide
          if (item.isAdminOnly && (!user || !user.isAdmin)) return null; // non-admin → hide

          return (
            <DropdownMenuItem key={item.name}>
              <WaspRouterLink
                to={item.to}
                onClick={() => {
                  setOpen(false); // close menu after navigating
                }}
                className="flex w-full items-center gap-3"
              >
                <item.icon size="1.1rem" />
                {item.name}
              </WaspRouterLink>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem>
          {/* click → Wasp logs you out (no fetch code!) */}
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3"
          >
            <LogOut size="1.1rem" />
            Log Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}