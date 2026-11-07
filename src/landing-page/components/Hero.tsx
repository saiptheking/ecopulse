import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../client/components/ui/button";
import { BackgroundBoxes } from "../../components/velora/background-boxes";
import { TextHoverEffect } from "../../components/velora/text-hover-effect";
import { MovingBorder } from "../../components/velora/moving-border";
import { AnimatedGradientText } from "../../components/velora/animated-gradient-text";
import { Typewriter } from "../../components/velora/typewriter";
import { RocketIcon } from "lucide-react";

import { ShimmerButton } from "../../components/velora/shimmer-button";
import openSaasBannerDark from "../../client/static/open-saas-banner-dark.svg"; // 🔥 swap: your screenshot
import openSaasBannerLight from "../../client/static/open-saas-banner-light.svg"; // 🔥 swap
export function Hero() {
  return (
    <div className="relative isolate w-full pt-14">
      {/* decorative gradient blobs (see functions at bottom of file) */}
      <TopGradient />
      <BottomGradient />
      <BackgroundBoxes className=" z-0 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
      <div className="relative md:p-24 z-10 pointer-events-none">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="lg:mb-18 mx-auto max-w-3xl text-center">
            
            {/* HEADLINE — swap for "Save the planet, one action at a time" */}
            <h1 className="text-foreground text-5xl font-bold sm:text-6xl">
              Welcome to{" "}
              <TextHoverEffect text="EcoPulse" className="pointer-events-auto p-5" />
            </h1>
            {/* SUBHEADLINE — swap for your one-sentence pitch */}
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
              Save the planet, one {" "}
              <AnimatedGradientText className="text-green-700 from-green-700 via-green-500 to-green-500">
                <Typewriter words={["action at a time.", "challenge at a time.", "photo at a time.", "point at a time.", "badge at a time."]} />
              </AnimatedGradientText>
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {/* PRIMARY CTA (filled) — the one you want clicked */}
          
                  <ShimmerButton className="pointer-events-auto">
                <WaspRouterLink to={routes.FeedRoute.to}>
                  Get Started <span aria-hidden="true">→</span>
                </WaspRouterLink>
              </ShimmerButton>
              
              <MovingBorder className="pointer-events-auto">
                <a href="https://saiprasadvalada.wixsite.com/ecopulse" target="_blank" rel="noopener noreferrer">
                  Learn More <span aria-hidden="true"></span>
                </a>
              </MovingBorder>
            </div>

          </div>
          {/* APP SCREENSHOT — light version (shown in light mode) */}
          <div className="mt-14 flow-root sm:mt-14">
            <div className="m-2 hidden justify-center rounded-xl md:flex lg:-m-4 lg:rounded-2xl lg:p-4">
              
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