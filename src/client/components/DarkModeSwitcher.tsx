// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: DarkModeSwitcher.tsx — A LIGHT/DARK MODE TOGGLE SWITCH
// ═══════════════════════════════════════════════════════════════════════════
// A picture-perfect beginner React example — read it as a pattern:
//
//   1. Custom hook for state → useColorMode() (defined in ../hooks/) gives
//      [colorMode, setColorMode] and persists the choice in localStorage.
//   2. Controlled input → the checkbox's `checked` prop comes FROM state and
//      `onChange` writes state back. Input value always equals state.
//   3. Conditional classes → cn(...) merges Tailwind classes; the moon/sun
//      icons fade in/out by switching opacity classes based on the mode.
//
// cn() (from ../utils) = clsx + tailwind-merge: it combines class strings,
// letting later classes override conflicting earlier ones.
//
// Eco Pulse note: your design is a DARK THEME. You can hardcode dark mode
// (or keep the toggle — optional). If you hardcode, delete this file and
// remove the `dark` class handling from useColorMode → actually simplest:
// keep it. Users like switching. :)
// ═══════════════════════════════════════════════════════════════════════════
import { Moon, Sun } from "lucide-react"; // icon library
import { Label } from "../../client/components/ui/label";
import { useColorMode } from "../hooks/useColorMode";
import { cn } from "../utils";

export function DarkModeSwitcher() {
  const [colorMode, setColorMode] = useColorMode(); // "light" | "dark", persisted
  const isInLightMode = colorMode === "light";

  return (
    <div>
      <Label
        className={cn(
          "bg-muted h-7.5 relative m-0 block w-14 cursor-pointer rounded-full transition-colors duration-300 ease-in-out",
        )}
      >
        {/* The real input is invisible (opacity-0) but covers the whole
            switch, so clicking anywhere toggles it. Classic CSS trick. */}
        <input
          type="checkbox"
          aria-label="Toggle dark mode"
          checked={!isInLightMode}
          onChange={() => {
            if (typeof setColorMode === "function") {
              setColorMode(isInLightMode ? "dark" : "light");
            }
          }}
          className="absolute top-0 z-50 m-0 h-full w-full cursor-pointer opacity-0"
        />
        {/* The sliding knob: translate-x-full pushes it right in dark mode */}
        <span
          className={cn(
            "border-border absolute left-[3px] top-1/2 flex h-6 w-6 -translate-y-1/2 translate-x-0 items-center justify-center rounded-full border bg-white shadow-md transition-all duration-300 ease-in-out",
            {
              "right-[3px]! translate-x-full!": !isInLightMode,
            },
          )}
        >
          <ModeIcon isInLightMode={isInLightMode} />
        </span>
      </Label>
    </div>
  );
}

// Small helper component: renders sun + moon, fades the inactive one out.
// NOTE the pattern: a component with a `props` object ({ isInLightMode }).
// This is Lesson 1 (props) in action — parent passes data down.
function ModeIcon({ isInLightMode }: { isInLightMode: boolean }) {
  const iconStyle =
    "absolute inset-0 flex items-center justify-center transition-opacity ease-in-out duration-300";
  return (
    <>
      <span
        className={cn(iconStyle, isInLightMode ? "opacity-100" : "opacity-0")}
      >
        <Sun className="size-4 fill-amber-500 stroke-amber-500" />
      </span>
      <span
        className={cn(iconStyle, !isInLightMode ? "opacity-100" : "opacity-0")}
      >
        <Moon className="size-4 fill-slate-600 stroke-slate-600" />
      </span>
    </>
  );
}