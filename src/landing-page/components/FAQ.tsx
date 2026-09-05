// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/FAQ.tsx — .map() OVER DATA → ACCORDION
// ═══════════════════════════════════════════════════════════════════════════
// The FAQ section. Two things worth noting:
//
//  1. PROPS-DRIVEN: the section doesn't know the questions. It receives
//     `faqs: FAQ[]` (the array from contentSections.tsx) and renders each
//     entry with .map(). Add a FAQ in contentSections → it appears here.
//
//  2. shadcn/ui ACCORDION = the expand/collapse UI. Accordion type="single"
//     = only one item open at a time; collapsible = click again to close.
//     Trigger = the clickable header, Content = the expandable body.
//
// ECO PULSE: keep, rewrite FAQ data ("How are points calculated?").
// ═══════════════════════════════════════════════════════════════════════════
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../client/components/ui/accordion";

// The shape of ONE faq entry (matches contentSections.tsx data):
interface FAQ {
  id: number;
  question: string;
  answer: string;
  href?: string; // optional "Learn more" link
}

export function FAQ({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className="mx-auto mt-32 max-w-4xl px-6 pb-8 sm:pb-24 sm:pt-12 lg:max-w-7xl lg:px-8 lg:py-32">
      <h2 className="text-foreground mb-12 text-center text-2xl font-bold leading-10 tracking-tight">
        Frequently asked questions
      </h2>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {/* map the data → one accordion item per FAQ */}
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.id} // React needs a stable unique key per list item
            value={`faq-${faq.id}`} // this item's ID for the accordion state
            className="border-border hover:bg-muted/20 rounded-lg border px-6 py-2 transition-all duration-200"
          >
            <AccordionTrigger className="text-foreground hover:text-primary text-left text-base font-semibold leading-7 transition-colors duration-200">
              {faq.question} {/* the clickable header */}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <div className="flex flex-col items-start justify-between gap-4">
                <p className="text-muted-foreground flex-1 text-base leading-7">
                  {faq.answer}
                </p>
                {/* optional extra link — only if faq.href exists */}
                {faq.href && (
                  <a
                    href={faq.href}
                    className="text-primary hover:text-primary/80 shrink-0 whitespace-nowrap text-base font-medium leading-7 transition-colors duration-200"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}