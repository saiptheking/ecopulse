// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/client/head.wasp.ts — CUSTOM <head> TAGS FOR EVERY PAGE
// ═══════════════════════════════════════════════════════════════════════════
// This is a plain list of HTML strings that Wasp injects into the <head> of
// your app's HTML. The <head> is the part of a web page that browsers read
// but users don't see: title, description, icons, social-share previews.
//
// WHY CARE? For Eco Pulse's landing page you'll want:
//   - a real description ("Gamified environmental action platform...")
//   - the right og:image (a banner so Discord/social links look nice)
//   - favicon (leaf icon)
//
// SECTIONS HERE:
//   favicon      → the little icon in the browser tab
//   meta         → description/author/keywords (SEO-ish)
//   og: + twitter → how links to your app look when shared on social media
//   script       → analytics tracker (Plausible) — 🔥 SKIP for now
//
// HOW TO USE: edit the strings, add/remove lines. Keep each line a complete
// HTML tag. When you deploy, replace the URLs with your real domain.
// ═══════════════════════════════════════════════════════════════════════════
import { type App } from "@wasp.sh/spec";

export const head: App["head"] = [
  "<link rel='icon' href='https://www.svgrepo.com/show/513512/leaf.svg' />", // browser-tab icon

  // ── SEO: what search engines show under your app's name ──
  "<meta name='description' content='A gamified environmental action platform' />", // → write a real one for Eco Pulse
  "<meta name='author' content='Eco Pulse' />",
  "<meta name='keywords' content='environment, sustainability, gamification' />", // → eco, environment, gamification
  "<meta name='google-site-verification' content='OENn6OG9nct29VFTnJg-QMKAsYNwcAbR06kE_iR8R6o' />",
  // ── Open Graph: the preview card when someone shares your URL ──
  "<meta property='og:type' content='website' />",
  "<meta property='og:title' content='Eco Pulse' />", // → "Eco Pulse"
  "<meta property='og:site_name' content='Eco Pulse' />",
  "<meta property='og:url' content='https://ecopulse-dev.vercel.app' />", // → your real domain
  "<meta property='og:description' content='A gamified environmental action platform' />",
  "<meta property='og:image' content='https://your-saas-app.com/public-banner.webp' />", // → your banner image

  // ── Twitter card: same idea, for Twitter/X previews ──
  "<meta name='twitter:image' content='https://your-saas-app.com/public-banner.webp' />",
  "<meta name='twitter:image:width' content='800' />",
  "<meta name='twitter:image:height' content='400' />",
  "<meta name='twitter:card' content='summary_large_image' />",
  // TODO: You can put your Plausible analytics scripts below (https://docs.opensaas.sh/guides/analytics/):
  // NOTE: Plausible does not use Cookies, so you can simply add the scripts here.
  // Google, on the other hand, does, so you must instead add the script dynamically
  // via the Cookie Consent component after the user clicks the "Accept" cookies button.
  "<script async data-domain='<your-site-id>' src='https://plausible.io/js/script.js'></script>", // for production
  "<script async data-domain='<your-site-id>' src='https://plausible.io/js/script.local.js'></script>", // for development
  // 🔥 DELETE the two script lines for now — you don't need analytics yet.
];