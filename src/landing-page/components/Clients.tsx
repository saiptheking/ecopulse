// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/Clients.tsx — "TRUSTED BY" LOGO STRIP
// ═══════════════════════════════════════════════════════════════════════════
// A row of partner logos. Interesting pattern: the LOGOS array stores
// JSX ELEMENTS directly:
//   { id: "salesforce", element: <SalesforceLogo /> }
// So the data structure contains components themselves, and rendering is
// trivial: logo.element. (You saw the `asChild` analog in Hero.)
//
// ⚠️ THIS COMPONENT IS NOT USED ANYWHERE (LandingPage doesn't import it)
// — it's a template leftover. You can delete it and the 4 logo files with
// it, or keep it for real partner/credits logos.
//
// ECO PULSE: if you keep it, show real partners ("Built with Wasp",
// "Supported by FoundUp") — not fictional companies.
// ═══════════════════════════════════════════════════════════════════════════
import { AstroLogo } from "../logos/AstroLogo";
import { OpenAILogo } from "../logos/OpenAILogo";
import { PrismaLogo } from "../logos/PrismaLogo";
import { SalesforceLogo } from "../logos/SalesforceLogo";

const LOGOS = [
  { id: "salesforce", element: <SalesforceLogo /> }, // JSX stored as data!
  { id: "prisma", element: <PrismaLogo /> },
  { id: "astro", element: <AstroLogo /> },
  { id: "openai", element: <OpenAILogo /> },
];

export function Clients() {
  return (
    <div className="items-between mx-auto mt-12 flex max-w-7xl flex-col gap-y-6 px-6 lg:px-8">
      <h2 className="text-muted-foreground mb-6 text-center font-semibold tracking-wide">
        Built with / Used by:
      </h2>

      <div className="mx-auto grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:gap-x-10 sm:gap-y-14 md:grid-cols-4 lg:mx-0 lg:max-w-none">
        {LOGOS.map((logo) => (
          <div
            key={logo.id}
            className="col-span-1 flex max-h-12 w-full justify-center object-contain opacity-80 transition-opacity hover:opacity-100"
          >
            {logo.element}
          </div>
        ))}
      </div>
    </div>
  );
}