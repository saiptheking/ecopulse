// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/Footer.tsx — THE FOOTER + ACCESSIBILITY
// ═══════════════════════════════════════════════════════════════════════════
// The page footer, also data-driven: footerNavigation (contentSections.tsx)
// has two link groups (app / company); this file maps over each column.
//
// ACCESSIBILITY IN ACTION:
//   aria-labelledby="footer-heading" → links this footer to its heading
//   <h2 className="sr-only">Footer</h2> → invisible heading that screen
//     readers still announce (sr-only = "screen-reader only").
//   role="list" on the <ul> — a hint for old screen readers.
// This is the pattern for any section of your Eco Pulse pages: give every
// section a labelled heading, even if it's sr-only.
//
// ECO PULSE: keep structure; point links at GitHub/About/Privacy/Terms.
// ═══════════════════════════════════════════════════════════════════════════
interface NavigationItem {
  name: string;
  href: string;
}

export function Footer({
  footerNavigation,
}: {
  footerNavigation: {
    app: NavigationItem[];
    company: NavigationItem[];
  };
}) {
  return (
    <div className="dark:bg-boxdark-2 mx-auto mt-6 max-w-7xl px-6 lg:px-8">
      <footer
        aria-labelledby="footer-heading"
        className="relative border-t border-gray-900/10 py-24 sm:mt-32 dark:border-gray-200/10"
      >
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mt-10 flex items-start justify-end gap-20">
          {/* Column 1: "App" links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              App
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.app.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Column 2: "Company" links */}
          <div>
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
              Company
            </h3>
            <ul role="list" className="mt-6 space-y-4">
              {footerNavigation.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-sm leading-6 text-gray-600 hover:text-gray-900 dark:text-white"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}