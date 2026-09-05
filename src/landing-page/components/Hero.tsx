// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/Hero.tsx — THE FIRST THING VISITORS SEE
// ═══════════════════════════════════════════════════════════════════════════
// THE CALL-TO-ACTION (CTA) PATTERN — every SaaS landing page's core:
//
//   <Button asChild><WaspRouterLink to={routes.SignupRoute.to}>...
//   `asChild` = "render MY child as the button's content" (shadcn technique).
//   So the whole thing becomes a <Link> styled like a Button. Two CTAs:
//   "Learn More" (outline) → PricingPage, "Get Started" (filled) → Signup.
//   The FILLED button is the one you want people to click.
//
//   WaspRouterLink is react-router's Link (to=route constant, no hardcoded
//   URLs). Routes come from main.wasp.ts route declarations.
//
// LIGHT/DARK IMAGE PATTERN: two <img> tags with CSS classes:
//   dark:hidden vs hidden dark:block — one swap based on the theme.
//   Eco Pulse: replace the banner images with your app screenshot.
//
// GRADIENT DECOR: TopGradient/BottomGradient are pure decoration
//   (blurred divs with clip-path shapes, aria-hidden). Copy-paste freely.
//
// 📌 ECO PULSE: rewrite the headline/subs/CTAs; "Get Started" should point
//   to SignupRoute (same), "Learn More" → your About/How-it-works page.
// ═══════════════════════════════════════════════════════════════════════════
import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../client/components/ui/button";
import openSaasBannerDark from "../../client/static/open-saas-banner-dark.svg"; // 🔥 swap: your screenshot
import openSaasBannerLight from "../../client/static/open-saas-banner-light.svg"; // 🔥 swap

export function Hero() {
  return (
    <div className="relative w-full pt-14">
      {/* decorative gradient blobs (see functions at bottom of file) */}
      <TopGradient />
      <BottomGradient />
      <div className="md:p-24">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="lg:mb-18 mx-auto max-w-3xl text-center">
            {/* HEADLINE — swap for "Save the planet, one action at a time" */}
            <h1 className="text-foreground text-5xl font-bold sm:text-6xl">
              Welcome to{" "}
              <span className="text-gradient-primary">Eco Pulse</span>
            </h1>
            {/* SUBHEADLINE — swap for your one-sentence pitch */}
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
              Save the planet, one action at a time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {/* PRIMARY CTA (filled) — the one you want clicked */}
              <Button size="lg" variant="default" asChild>
                <WaspRouterLink to={routes.FeedRoute.to}>
                  Get Started <span aria-hidden="true">→</span>
                </WaspRouterLink>
              </Button>
            </div>
          </div>
          {/* APP SCREENSHOT — light version (shown in light mode) */}
          <div className="mt-14 flow-root sm:mt-14">
            <div className="m-2 hidden justify-center rounded-xl md:flex lg:-m-4 lg:rounded-2xl lg:p-4">
              <img
                src="https://www.svgrepo.com/show/484764/leaf.svg"
                alt="App screenshot"
                width={1000}
                height={530}
                loading="lazy"
                className="rounded-md dark:hidden"
              />
              {/* dark version (shown only in dark mode) */}
              <img
                src="https://www.svgrepo.com/show/484290/leaf.svg"
                alt="App screenshot"
                width={1000}
                height={530}
                loading="lazy"
                className="hidden rounded-md dark:block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── DECORATION ONLY: blurred colorful shapes behind the hero ───────────────
// -z-10 pushes them behind the text; opacity-10 keeps them subtle;
// clipPath crops the div into a star/ellipse shape. No logic, just looks.
function TopGradient() {
  return (
    <div
      className="absolute right-0 top-0 -z-10 w-full transform-gpu overflow-hidden blur-3xl sm:top-0"
      aria-hidden="true" // screen readers: this is decoration, ignore me
    >
      <div
        className="aspect-1020/880 w-280 bg-linear-to-tr flex-none from-amber-400 to-purple-300 opacity-10 sm:right-1/4 sm:translate-x-1/2 dark:hidden"
        style={{
          clipPath:
            "polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)",
        }}
      />
    </div>
  );
}

function BottomGradient() {
  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-65rem)]"
      aria-hidden="true"
    >
      <div
        className="aspect-1020/880 w-360 bg-linear-to-br relative from-amber-400 to-purple-300 opacity-10 sm:-left-3/4 sm:translate-x-1/4 dark:hidden"
        style={{
          clipPath: "ellipse(80% 30% at 80% 50%)",
        }}
      />
    </div>
  );
}