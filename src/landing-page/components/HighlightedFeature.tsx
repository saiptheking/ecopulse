// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/HighlightedFeature.tsx — THE "SLOT" COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
// The counterpart to ExampleHighlightedFeature.tsx: this component DEFINES
// the layout with a slot, the other file FILLS the slot.
//
//   <HighlightedFeature
//     name="..."
//     description="..."          ← text side
//     highlightedComponent={<X />} ← THE SLOT: any JSX goes here
//     direction="row-reverse"   ← text right / media left (or "row")
//     tilt="left"               ← subtle rotate for style
//   />
//
// Props defaulting: direction = "row" — if the caller omits it, you get row.
// Config table: tilt "left"→"rotate-1", "right"→"-rotate-1" (small rotation).
//
// ECO PULSE: use it for "How it works" / feature showcases — drop any
// demo component into the slot.
// ═══════════════════════════════════════════════════════════════════════════
import { cn } from "../../client/utils";

interface FeatureProps {
  name: string;
  description: string | React.ReactNode;
  direction?: "row" | "row-reverse";
  highlightedComponent: React.ReactNode; // ← the slot: caller-provided JSX
  tilt?: "left" | "right";
}

/**
 * A component that highlights a feature with a description and a highlighted component.
 * Shows text description on one side, and whatever component you want to show on the other side to demonstrate the functionality.
 */
export function HighlightedFeature({
  name,
  description,
  direction = "row", // default: text on the left
  highlightedComponent,
  tilt,
}: FeatureProps) {
  // Config table: tilt string → rotation utility class:
  const tiltToClass: Record<Required<FeatureProps>["tilt"], string> = {
    left: "rotate-1",
    right: "-rotate-1",
  };

  return (
    <div
      className={cn(
        "my-50 mx-auto flex max-w-6xl flex-col items-center justify-between gap-x-20 gap-y-10 px-8 transition-all duration-300 ease-in-out md:px-4",
        // row → content side-by-side (desktop); row-reverse flips sides:
        direction === "row" ? "md:flex-row" : "md:flex-row-reverse",
      )}
    >
      {/* TEXT SIDE */}
      <div className="flex-1 flex-col">
        <h2 className="mb-2 text-4xl font-bold">{name}</h2>
        {/* string → styled <p>; JSX → rendered as given (same trick as
            SectionTitle — see that file) */}
        {typeof description === "string" ? (
          <p className="text-muted-foreground">{description}</p>
        ) : (
          description
        )}
      </div>
      {/* MEDIA SIDE (the slot) */}
      <div
        className={cn(
          "my-10 flex w-full flex-1 items-center justify-center transition-transform duration-300 ease-in-out",
          tilt && tiltToClass[tilt],
        )}
      >
        {highlightedComponent}
      </div>
    </div>
  );
}