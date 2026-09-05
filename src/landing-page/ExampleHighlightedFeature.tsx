// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: ExampleHighlightedFeature.tsx — A COMPONENT AS A PROP (advanced)
// ═══════════════════════════════════════════════════════════════════════════
// This file demonstrates the "render prop" / "slot" pattern:
//
//   <HighlightedFeature highlightedComponent={<AIReadyExample />} ...>
//
// You pass actual JSX (a whole component!) INTO a prop. HighlightedFeature
// just places it where it belongs in its own layout — the slot pattern.
// This is how component libraries let YOU inject content without you
// rewriting their markup. Image-swap trick again: two <img> with
// dark:hidden / hidden dark:block (theme-dependent).
//
// 📌 ECO PULSE: this is a nice skeleton for a "How it works" section —
// replace AIReadyExample's images with screenshots of your app (or the
// Figma prototype). If you don't need it, delete both files.
// ═══════════════════════════════════════════════════════════════════════════
import aiReadyDark from "../client/static/assets/aiready-dark.webp"; // 🔥 swap/delete
import aiReady from "../client/static/assets/aiready.webp"; // 🔥 swap/delete
import { HighlightedFeature } from "./components/HighlightedFeature";

export function AIReady() {
  return (
    <HighlightedFeature
      name="Example Feature Highlight" // 🔥 → "How Eco Pulse works"
      description="Yo! Use this component to show off the most important features in your app."
      highlightedComponent={<AIReadyExample />} // ← the slot: insert any JSX
      direction="row-reverse" // image on the right (or "row" for left)
    />
  );
}

function AIReadyExample() {
  return (
    <div className="w-full">
      <img
        src={aiReady}
        alt="AI Ready"
        loading="lazy"
        className="dark:hidden" // light-mode image
      />
      <img
        src={aiReadyDark}
        alt="AI Ready"
        loading="lazy"
        className="hidden dark:block" // dark-mode image
      />
    </div>
  );
}