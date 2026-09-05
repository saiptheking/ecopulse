// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/ExamplesCarousel.tsx — THE HOOKS MASTERCLASS
// ═══════════════════════════════════════════════════════════════════════════
// The most advanced file in the landing page. Read the HOOK CHEAT SHEET:
//
//   useRef(x)        → a box that survives re-renders WITHOUT triggering
//                      them. ref.current holds a value you mutate freely
//                      (here: DOM elements + timers). "The escape hatch."
//   useEffect(fn, [deps]) → run fn AFTER the render. Re-runs when deps
//                      change; the return value is a CLEANUP fn.
//   setInterval/setTimeout + cleanup → timers MUST be cleared in the
//                      cleanup, or they leak forever (battery + bugs).
//   IntersectionObserver → browser API: calls back when an element enters
//                      the viewport. Here: only auto-play when SEEN
//                      (isInView) — polite autoplay.
//   setCurrentExample((prev) => (prev + 1) % examples.length) → "next one,
//                      wrapping around at the end" (modulo = wrap-around).
//
// FLOW: observer sets isInView → when visible, interval advances
// currentExample every 3s → second effect scrolls the strip so the
// current card is centered (math with getBoundingClientRect).
//
// ⚠️ Uses index as key (key={index}) — fine for a static demo list; not
// ideal if items reorder (React docs recommend stable IDs).
//
// 📌 ECO PULSE: this is auto-carousel + scroll-snap you can clone for a
// "community actions" strip. Otherwise delete with the other demo content.
// ═══════════════════════════════════════════════════════════════════════════
import { Ref, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "../../client/components/ui/card";

const EXAMPLES_CAROUSEL_INTERVAL = 3000; // ms between auto-advances
const EXAMPLES_CAROUSEL_SCROLL_TIMEOUT = 200; // ms before scroll after advance

interface ExampleApp {
  name: string;
  description: string;
  imageSrc: string;
  href: string;
}

export function ExamplesCarousel({ examples }: { examples: ExampleApp[] }) {
  // STATE (triggers re-render):
  const [currentExample, setCurrentExample] = useState(0); // which card is "current"
  const [isInView, setIsInView] = useState(false); // is the carousel visible?
  // REFS (do NOT trigger re-render — just hold values):
  const containerRef = useRef<HTMLDivElement>(null); // observed element
  const scrollContainerRef = useRef<HTMLDivElement>(null); // the scroll strip
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // auto-play timer
  const observerRef = useRef<IntersectionObserver | null>(null); // visibility watcher
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // scroll timer

  // EFFECT 1 (runs once — empty deps []): set up the visibility observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting), // visible → true
      {
        threshold: 0.5, // half the element must be on screen
        rootMargin: "-200px 0px -100px 0px", // shrink the detection window
      },
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      // CLEANUP: stop watching when the component unmounts
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // EFFECT 2 (re-runs when isInView/currentExample changes): the timer dance
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // kill any old timer first
    }

    if (isInView && examples.length > 1) {
      // Only auto-play when visible AND there's more than one example:
      intervalRef.current = setInterval(() => {
        setCurrentExample((prev) => (prev + 1) % examples.length); // wrap-around
      }, EXAMPLES_CAROUSEL_INTERVAL);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Scroll the current card to the CENTER of the strip:
    scrollTimeoutRef.current = setTimeout(() => {
      if (scrollContainerRef.current) {
        const scrollContainer = scrollContainerRef.current;
        const targetCard = scrollContainer.children[currentExample] as
          | HTMLElement
          | undefined;

        if (targetCard) {
          const containerRect = scrollContainer.getBoundingClientRect();
          const cardRect = targetCard.getBoundingClientRect();
          // scrollLeft = card's position − container's position,
          // centered: − half container width + half card width:
          const scrollLeft =
            targetCard.offsetLeft -
            scrollContainer.offsetLeft -
            containerRect.width / 2 +
            cardRect.width / 2;

          scrollContainer.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
          });
        }
      }
    }, EXAMPLES_CAROUSEL_SCROLL_TIMEOUT);

    // CLEANUP: clear BOTH timers on unmount / before the next run
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isInView, examples.length, currentExample]);

  // Hovering a card jumps to it + restarts the timer (so it doesn't
  // auto-advance away the moment you look at it):
  const handleMouseEnter = (index: number) => {
    setCurrentExample(index);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (isInView && examples.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentExample((prev) => (prev + 1) % examples.length);
      }, EXAMPLES_CAROUSEL_INTERVAL);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative left-1/2 my-16 flex w-screen -translate-x-1/2 flex-col items-center"
    >
      <h2 className="text-muted-foreground mb-6 text-center font-semibold tracking-wide">
        Used by:
      </h2>
      <div className="w-full max-w-full overflow-hidden">
        {/* scroll-snap: the browser snaps to each card while scrolling */}
        <div
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-10 pt-4"
          ref={scrollContainerRef}
        >
          {examples.map((example, index) => (
            <ExampleCard
              key={index} // ⚠️ index-as-key — ok for a static list
              example={example}
              index={index}
              isCurrent={index === currentExample}
              onMouseEnter={handleMouseEnter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ExampleCardProps {
  example: ExampleApp;
  index: number;
  isCurrent: boolean;
  onMouseEnter: (index: number) => void;
  ref?: Ref<HTMLDivElement>;
}

function ExampleCard({
  example,
  index,
  isCurrent,
  onMouseEnter,
  ref,
}: ExampleCardProps) {
  return (
    <a
      href={example.href}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 snap-center"
      onMouseEnter={() => onMouseEnter(index)} // ← hover = jump carousel here
    >
      <Card
        ref={ref}
        className="w-[280px] overflow-hidden transition-all duration-200 hover:scale-105 sm:w-[320px] md:w-[350px]"
        variant={isCurrent ? "default" : "faded"} // highlight the current card
      >
        <CardContent className="h-full p-0">
          <img
            src={example.imageSrc}
            alt={example.name}
            className="aspect-video h-auto w-full object-cover object-top"
          />
          <div className="p-4">
            <p className="font-bold">{example.name}</p>
            <p className="text-muted-foreground text-xs">
              {example.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}