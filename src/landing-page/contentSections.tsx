// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/landing-page/contentSections.tsx — CONTENT-AS-DATA
// ═══════════════════════════════════════════════════════════════════════════
// The SECOND big React idea (after LandingPage's composition): content lives
// HERE as plain data, not buried in JSX. The components (FeaturesGrid, FAQ,
// Footer...) receive these arrays via props and render them with .map().
//
// CHANGE THE DATA → THE PAGE CHANGES. No component code touched. That's
// the "data-driven UI" pattern, and it's how you'll build the Eco Pulse
// admin experience later (challenges are data, the grid is the UI).
//
// 📌 ECO PULSE REWRITE PLAN:
//   - features[] → your 6 core eco features:
//       🌱 "Complete Eco Challenges" (small), 🪙 "Earn Greeny Coins" (large),
//       🏆 "Climb the Leaderboard" (large), 📸 "Photo Verification" (small)...
//     href: DocsUrl → link to your app pages or leave out.
//   - examples[]  → DELETE (they're other products' screenshots) or replace
//     with "sample actions" (tree planting, bike commute...).
//   - testimonials[] → DELETE the fake quotes; use real beta testers later.
//   - faqs[]      → rewrite. "What is Eco Pulse?" "How do points work?"
//   - footerNavigation → your links: GitHub, About, Privacy, Terms.
// ═══════════════════════════════════════════════════════════════════════════
import daBoiAvatar from "../client/static/da-boi.webp"; // 🔥 delete w/ testimonials
import kivo from "../client/static/examples/kivo.webp"; // 🔥 delete w/ examples
import messync from "../client/static/examples/messync.webp";
import microinfluencerClub from "../client/static/examples/microinfluencers.webp";
import promptpanda from "../client/static/examples/promptpanda.webp";
import reviewradar from "../client/static/examples/reviewradar.webp";
import scribeist from "../client/static/examples/scribeist.webp";
import searchcraft from "../client/static/examples/searchcraft.webp";
import { BlogUrl, DocsUrl } from "../shared/common"; // 🔥 swap for your links
import type { GridFeature } from "./components/FeaturesGrid";

// ── The "features" grid: each entry = one card in FeaturesGrid ────────────
export const features: GridFeature[] = [
  {
    name: "Cool Feature 1", // 🔥 → "Complete Eco Challenges"
    description: "Your feature",
    emoji: "🤝",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 2", // 🔥 → "Earn Greeny Coins"
    description: "Feature description",
    emoji: "🔐",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 3",
    description: "Describe your cool feature here",
    emoji: "🥞",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Cool Feature 4",
    description: "Describe your cool feature here",
    emoji: "💸",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Cool Feature 5",
    description: "Describe your cool feature here",
    emoji: "💼",
    href: DocsUrl,
    size: "large",
  },
  {
    name: "Cool Feature 6",
    description: "It is cool",
    emoji: "📈",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 7",
    description: "Cool feature",
    emoji: "📧",
    href: DocsUrl,
    size: "small",
  },
  {
    name: "Cool Feature 8",
    description: "Describe your cool feature here",
    emoji: "🤖",
    href: DocsUrl,
    size: "medium",
  },
  {
    name: "Cool Feature 9",
    description: "Describe your cool feature here",
    emoji: "🚀",
    href: DocsUrl,
    size: "medium",
  },
];

// ── Testimonial cards (🔥 all fake — DELETE for Eco Pulse) ────────────────
export const testimonials = [
  {
    name: "Da Boi",
    role: "Wasp Mascot",
    avatarSrc: daBoiAvatar,
    socialUrl: "https://twitter.com/wasplang",
    quote: "I don't even know how to code. I'm just a plushie.",
  },
  {
    name: "Mr. Foobar",
    role: "Founder @ Cool Startup",
    avatarSrc: daBoiAvatar,
    socialUrl: "",
    quote: "This product makes me cooler than I already am.",
  },
  {
    name: "Jamie",
    role: "Happy Customer",
    avatarSrc: daBoiAvatar,
    socialUrl: "#",
    quote: "My cats love it!",
  },
];

// ── FAQ accordion entries ──────────────────────────────────────────────────
export const faqs = [
  {
    id: 1,
    question: "Whats the meaning of life?", // 🔥 → "How do I earn points?"
    answer: "42.", // 🔥 → real answer
    href: "https://en.wikipedia.org/wiki/42_(number)", // 🔥 → ""
  },
];

// ── Footer link groups: TWO columns (app / company) ───────────────────────
export const footerNavigation = {
  app: [
    { name: "Documentation", href: "" },
    { name: "Blog", href: "" },
  ],
  company: [
    { name: "About", href: "https://saiprasadvalada.wixsite.com/ecopulse" },
    { name: "Privacy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ],
};

// ── Carousel slides (🔥 screenshots of OTHER products — delete/replace) ───
export const examples = [
  {
    name: "Example #1",
    description: "Describe your example here.",
    imageSrc: kivo,
    href: "#",
  },
  {
    name: "Example #2",
    description: "Describe your example here.",
    imageSrc: messync,
    href: "#",
  },
  {
    name: "Example #3",
    description: "Describe your example here.",
    imageSrc: microinfluencerClub,
    href: "#",
  },
  {
    name: "Example #4",
    description: "Describe your example here.",
    imageSrc: promptpanda,
    href: "#",
  },
  {
    name: "Example #5",
    description: "Describe your example here.",
    imageSrc: reviewradar,
    href: "#",
  },
  {
    name: "Example #6",
    description: "Describe your example here.",
    imageSrc: scribeist,
    href: "#",
  },
  {
    name: "Example #7",
    description: "Describe your example here.",
    imageSrc: searchcraft,
    href: "#",
  },
];