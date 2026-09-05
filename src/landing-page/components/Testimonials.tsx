// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/Testimonials.tsx — useState() IN THE WILD
// ═══════════════════════════════════════════════════════════════════════════
// The testimonials wall. React lesson: STATE CONTROL OF WHAT'S VISIBLE.
//
//   const [isExpanded, setIsExpanded] = useState(false);
//     → on phones, showing 8 testimonials is too tall, so:
//       - testimonials.length > 5  → shouldShowExpand (show a button)
//       - !isExpanded              → only render the first 3 (mobileItemsToShow)
//       - .slice(0, itemsToShow)   → cut the array before mapping
//     → clicking the button flips isExpanded → list grows/shrinks.
//     The "Show More" pattern. You'll use it constantly.
//
// KEY: the button only exists on small screens (md:hidden) — desktop
// always shows everything in its 2-3 column masonry layout (columns-1/2/3).
//
// ECO PULSE: feed it real quotes later; DELETE the template fakes.
// ═══════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../../client/components/ui/card";
import { SectionTitle } from "./SectionTitle";

interface Testimonial {
  name: string;
  role: string;
  avatarSrc: string;
  socialUrl: string;
  quote: string;
}

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  // STATE: is the mobile list expanded or collapsed?
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowExpand = testimonials.length > 5; // enough to need a button?
  const mobileItemsToShow = 3; // collapsed → show 3
  const itemsToShow =
    shouldShowExpand && !isExpanded ? mobileItemsToShow : testimonials.length;

  return (
    <div className="mx-auto mt-32 max-w-7xl sm:mt-56 sm:px-6 lg:px-8">
      <SectionTitle title="What Our Users Say" />

      {/* masonry via CSS columns (1 col mobile → 2 → 3 on desktop) */}
      <div className="relative z-10 w-full columns-1 gap-2 px-4 md:columns-2 md:gap-6 md:px-0 lg:columns-3">
        {/* slice() the array first, then map — data shaping before render */}
        {testimonials.slice(0, itemsToShow).map((testimonial, idx) => (
          <div key={idx} className="mb-6 break-inside-avoid">
            <Card className="flex flex-col justify-between">
              <CardContent className="p-6">
                <blockquote className="mb-4 leading-6">
                  <p className="text-sm italic">{testimonial.quote}</p>
                </blockquote>
              </CardContent>
              <CardFooter className="flex flex-col pt-0">
                <a
                  href={testimonial.socialUrl}
                  className="group flex w-full items-center gap-x-3 transition-all duration-200 hover:opacity-80"
                >
                  <img
                    src={testimonial.avatarSrc}
                    loading="lazy"
                    alt={`${testimonial.name}'s avatar`}
                    className="ring-border/20 group-hover:ring-primary/30 h-10 w-10 shrink-0 rounded-full ring-2 transition-all duration-200"
                  />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="group-hover:text-card-foreground truncate text-sm font-semibold transition-colors duration-200">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="truncate text-xs">
                      {testimonial.role}
                    </CardDescription>
                  </div>
                </a>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>

      {/* the Show More / Show Less toggle (mobile only: md:hidden) */}
      {shouldShowExpand && (
        <div className="mt-8 flex justify-center md:hidden">
          <button
            onClick={() => setIsExpanded(!isExpanded)} // ← flip state on click
            className="text-primary bg-primary/10 hover:bg-primary/20 rounded-lg px-6 py-3 text-sm font-medium transition-colors duration-200"
          >
            {isExpanded
              ? "Show Less"
              : `Show ${testimonials.length - mobileItemsToShow} More`}
          </button>
        </div>
      )}
    </div>
  );
}