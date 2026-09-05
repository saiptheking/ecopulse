// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/SectionTitle.tsx — PROPS + CONDITIONAL RENDERING
// ═══════════════════════════════════════════════════════════════════════════
// A reusable "section heading" used by Features/Testimonials/FAQ.
// Two React lessons packed in here:
//
//  1. PROPS WITH TYPES — the component expects
//       { title, description, titleComponent? }
//     `title?: string | React.ReactNode` means "a string, OR any JSX".
//     The caller chooses; the component handles both.
//
//  2. CONDITIONAL RENDERING — `typeof title === "string" ? <h3>... : title`
//     If you pass a string → render the styled <h3>.
//     If you pass JSX → render YOUR JSX as-is (caller takes over styling).
//     Same for description. This makes the component flexible without
//     branching into special cases.
//
//  (titleComponent is declared in the type but unused — a template leftover;
//   not an error, just dead weight you can remove.)
//
// 📌 ECO PULSE: reuse as-is for every section heading.
// ═══════════════════════════════════════════════════════════════════════════
export function SectionTitle({
  title,
  description,
}: {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  titleComponent?: React.ReactNode; // declared but unused — can delete
}) {
  // string → styled heading element; JSX → pass through untouched:
  const titleElement =
    typeof title === "string" ? (
      <h3 className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h3>
    ) : (
      title
    );
  const descriptionElement =
    typeof description === "string" ? (
      <p className="text-muted-foreground mt-4 text-lg leading-8">
        {description}
      </p>
    ) : (
      description
    );

  return (
    <div className="mx-auto mb-8 max-w-2xl text-center">
      {titleElement}
      {descriptionElement}
    </div>
  );
}