// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/landing-page/LandingPage.tsx — COMPOSITION MASTERCLASS
// ═══════════════════════════════════════════════════════════════════════════
// This 32-line file is the single best React lesson in the whole template.
// LandingPage does NOT contain the landing page. It ASSEMBLES it:
//
//   import section components (Hero, FeaturesGrid, FAQ, Footer, ...)
//   import DATA from contentSections.tsx (examples, faqs, features, ...)
//   then stack them in JSX order = the on-screen order, top to bottom.
//
// THE BIG IDEA: components are LEGO bricks, data flows IN via props.
//   <FeaturesGrid features={features} />  ← pass data as a prop
//   The component renders whatever array you give it. Swap the array
//   content, the page changes — you never touch the component.
//
// 📌 ECO PULSE: this file is your rewrite target. Keep the skeleton,
// swap the pieces:
//   <Hero />              → Eco Pulse headline + tagline
//   <ExamplesCarousel />  → DELETE (or "community actions" showcase)
//   <AIReady />           → DELETE (OpenSaaS promo image)
//   <FeaturesGrid />      → eco features (challenges, points, leaderboard)
//   <Testimonials />      → fake quotes → DELETE or real beta users
//   <FAQ />               → keep, real FAQs ("how do points work?")
//   <Footer />            → keep, your links
// ═══════════════════════════════════════════════════════════════════════════
import { ExamplesCarousel } from "./components/ExamplesCarousel";
import { FAQ } from "./components/FAQ";
import { FeaturesGrid } from "./components/FeaturesGrid";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { SchemaMarkup } from "./components/SchemaMarkup";
import { Testimonials } from "./components/Testimonials";
import {
  examples, // data, from contentSections.tsx ↓
  faqs,
  features,
  footerNavigation,
  testimonials,
} from "./contentSections";
import { AIReady } from "./ExampleHighlightedFeature";

export function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* invisible SEO block (JSON-LD) — bots love it, users don't see it */}
      <SchemaMarkup />
      <main className="isolate">
        {/* JSX ORDER == ON-SCREEN ORDER. Read top to bottom: */}
        <Hero />
      </main>
      <Footer footerNavigation={footerNavigation} />
    </div>
  );
}