// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: cookie-consent/Config.ts — THE BANNER'S SETTINGS
// ═══════════════════════════════════════════════════════════════════════════
// A big config OBJECT passed to the cookieconsent library. You rarely touch
// this unless you add tracking. Read it as "config-object" practice:
//
//   root          → where the modal is injected ("body")
//   autoShow      → show it automatically on first visit
//   mode: "opt-in"→ analytics start OFF; user must accept
//   revision      → bump when you change what cookies you use
//   categories    → "necessary" (always on, unchangeable) vs "analytics"
//   services.ga   → the Google Analytics loader (only loads after Accept!)
//   language      → English texts of the buttons/footer
//
// THE ONE LINE YOU'LL MESS WITH IN DEV:
//   hideFromBots: import.meta.env.PROD ? true : false
//   → in dev (vite) the banner is visible so you can test it.
//
// Eco Pulse: if you cut the banner entirely, delete this file with it.
// If you keep it, replace the placeholder Privacy/Terms URLs in the footer.
// ═══════════════════════════════════════════════════════════════════════════
import type { CookieConsentConfig } from "vanilla-cookieconsent";

declare global {
  interface Window {
    dataLayer: unknown[]; // Google Analytics global array
  }
}

export const getConfig = () => {
  // See https://cookieconsent.orestbida.com/reference/configuration-reference.html for configuration options.
  const config: CookieConsentConfig = {
    // Default configuration for the modal.
    root: "body",
    autoShow: true,
    disablePageInteraction: false,
    hideFromBots: import.meta.env.PROD ? true : false, // Set this to false for dev/headless tests otherwise the modal will not be visible.
    mode: "opt-in", // user must opt IN to analytics
    // Bump the revision field when you add new services
    revision: 0,

    // Default configuration for the cookie.
    cookie: {
      name: "cc_cookie", // where consent is stored
      domain: location.hostname,
      path: "/",
      sameSite: "Lax",
      expiresAfterDays: 365,
    },

    guiOptions: {
      consentModal: {
        layout: "box",
        position: "bottom right",
        equalWeightButtons: true,
        flipButtons: false,
      },
    },

    categories: {
      necessary: {
        enabled: true, // this category is enabled by default
        readOnly: true, // this category cannot be disabled
      },
      analytics: {
        // When the user REJECTS analytics, delete these GA cookies:
        autoClear: {
          cookies: [
            {
              name: /^_ga/, // regex: match all cookies starting with '_ga'
            },
            {
              name: "_gid", // string: exact cookie name
            },
          ],
        },

        // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
        services: {
          ga: {
            label: "Google Analytics",
            onAccept: () => {
              // ← runs only after the user clicks "Accept all"
              try {
                const GA_ANALYTICS_ID = import.meta.env
                  .REACT_APP_GOOGLE_ANALYTICS_ID;
                if (!GA_ANALYTICS_ID.length) {
                  throw new Error("Google Analytics ID is missing");
                }
                window.dataLayer = window.dataLayer || [];
                // Google's gtag.js initialization snippet relies on pushing the
                // arguments object (not a real array) into dataLayer, so the
                // gtag.js loader can replay queued events correctly.
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                function gtag(..._args: unknown[]) {
                  // eslint-disable-next-line prefer-rest-params
                  window.dataLayer.push(arguments);
                }
                gtag("js", new Date());
                gtag("config", GA_ANALYTICS_ID);

                // Adding the script tag dynamically to the DOM.
                const script = document.createElement("script");
                script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ANALYTICS_ID}`;
                script.async = true;
                document.body.appendChild(script);
              } catch (error) {
                console.error(error);
              }
            },
            onReject: () => {}, // 🔥 replace with autoplay/anything you want to stop
          },
        },
      },
    },

    language: {
      default: "en",
      translations: {
        en: {
          consentModal: {
            title: "We use cookies",
            description:
              "We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookie policy.",
            acceptAllBtn: "Accept all",
            acceptNecessaryBtn: "Reject all",
            // showPreferencesBtn: 'Manage Individual preferences', // (OPTIONAL) Activates the preferences modal
            // TODO: Add your own privacy policy and terms and conditions links below.
            footer: `
            <a href="<your-url-here>" target="_blank">Privacy Policy</a>
            <a href="<your-url-here>" target="_blank">Terms and Conditions</a>
                    `,
          },
          // The showPreferencesBtn activates this modal to manage individual preferences https://cookieconsent.orestbida.com/reference/configuration-reference.html#translation-preferencesmodal
          preferencesModal: {
            sections: [],
          },
        },
      },
    },
  };

  return config;
};