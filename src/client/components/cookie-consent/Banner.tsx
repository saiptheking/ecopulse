// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: cookie-consent/Banner.tsx — THE "WE USE COOKIES" POPUP
// ═══════════════════════════════════════════════════════════════════════════
// Renders the GDPR cookie banner using the vanilla-cookieconsent library.
//
// HOW IT WORKS:
//   1. import * as CookieConsent → the whole third-party library
//   2. CookieConsent.run(getConfig()) fires ONCE on mount (empty deps array),
//      with all the settings/translations from Config.ts
//   3. The <div id="cookieconsent"> is where the library injects its UI
//
// Eco Pulse: if you use NO analytics cookies, you don't legally need this
// banner at all. The file's own note says what to delete (component +
// Config.ts + import in App.tsx + `npm uninstall vanilla-cookieconsent`).
// Keep it only if you add analytics later.
// ═══════════════════════════════════════════════════════════════════════════
import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css"; // the library's styles
import { getConfig } from "./Config";

/**
 * NOTE: if you do not want to use the cookie consent banner, you should
 * run `npm uninstall vanilla-cookieconsent`, and delete this component, its config file,
 * as well as its import in src/client/App.tsx .
 */
export function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run(getConfig());
  }, []); // empty deps = run once when the app loads

  return <div id="cookieconsent"></div>; // the library's mount point
}