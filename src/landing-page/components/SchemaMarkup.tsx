// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: components/SchemaMarkup.tsx — SEO FOR BOTS AND AI
// ═══════════════════════════════════════════════════════════════════════════
// Renders a <script type="application/ld+json"> block: JSON-LD structured
// data that Google (and LLMs doing AI answers) read to *understand* what
// your site is. Invisible to human visitors, valuable for search engines.
//
// The pattern: a data object → JSON.stringify → injected as a script tag.
//
// ⚠️ IMPORTANT: everything here is PLACEHOLDER data pointing at
// "your-saas-app.com" — if you forget to update it, Google will index
// wrong/missing info about Eco Pulse. You should replace the whole object
// for your real domain once you have one.
//
// ECO PULSE: keep the component; rewrite the schema object with:
//   @type: SoftwareApplication
//   name: "Eco Pulse"
//   description: your real pitch
//   url: your future domain
//   image: your banner
// ═══════════════════════════════════════════════════════════════════════════
// JSON-LD structured data for SEO. Helps search engines and LLMs understand
// your app so it can appear in rich results and AI answers. Customize the
// placeholders below to match your product. See https://schema.org for types.
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://your-saas-app.com/#software", // 🔥 → ecopulse real URL
      name: "Your Open SaaS App", // 🔥 → "Eco Pulse"
      description: "Your apps main description and features.", // 🔥 → real pitch
      url: "https://your-saas-app.com", // 🔥
      applicationCategory: "BusinessApplication", // 🔥 → "LifestyleApplication"?
      operatingSystem: "Cross-platform",
      image: "https://your-saas-app.com/public-banner.webp", // 🔥
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://your-saas-app.com/#website", // 🔥
      url: "https://your-saas-app.com", // 🔥
      name: "Your Open SaaS App", // 🔥 → "Eco Pulse"
      description: "Your apps main description and features.", // 🔥
    },
  ],
};

export function SchemaMarkup() {
  // JSON.stringify = turn the object into a JSON string for the script tag:
  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
}