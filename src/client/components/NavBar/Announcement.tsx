// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: NavBar/Announcement.tsx — THE TOP PROMO BANNER
// ═══════════════════════════════════════════════════════════════════════════
// The thin colored strip at the very top of the navbar: "Star Our Repo ⭐".
// Pure static JSX — no state, no props. Three <a> links: two for wide
// screens (lg:block), one for mobile (lg:hidden). Tailwind responsive
// prefixes (lg:) = "only apply on large screens".
//
// Eco Pulse: replace the content with your own announcement ("Join the
// Beta!", "Demo Day is coming!") or delete this file + its usage in
// NavBar.tsx if you don't want a banner.
// ═══════════════════════════════════════════════════════════════════════════
const ANNOUNCEMENT_URL = "https://github.com/wasp-lang/wasp"; // 🔥 change to your repo

export function Announcement() {
  return (
    <div className="from-accent to-secondary text-primary-foreground bg-linear-to-r relative flex w-full items-center justify-center gap-3 p-3 text-center font-semibold">
      <a
        href={ANNOUNCEMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden cursor-pointer transition-opacity hover:opacity-90 hover:drop-shadow-sm lg:block"
      >
        Like this app?  
      </a>
      <div className="bg-primary-foreground/20 hidden w-0.5 self-stretch lg:block"></div>
      <a
        href={ANNOUNCEMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-background/20 hover:bg-background/30 hidden cursor-pointer rounded-full px-2.5 py-1 text-xs tracking-wider transition-colors lg:block"
      >
        Check it out on Github!
      </a>
      <a
        href={ANNOUNCEMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-background/20 hover:bg-background/30 cursor-pointer rounded-full px-2.5 py-1 text-xs transition-colors lg:hidden"
      >
        Check it out on Github!
      </a>
    </div>
  );
}