// ═══════════════════════════════════════════════════════════════════════════
// OBITEACH: src/user/AccountPage.tsx — YOUR "MY ACCOUNT" PAGE
// ═══════════════════════════════════════════════════════════════════════════
// The page behind "/account". First thing to see: the `user` PROP.
//   export function AccountPage({ user }: { user: User })
// Because the route was declared with { authRequired: true }, Wasp injects
// the logged-in user as a prop — you never fetch it yourself here. THAT is
// the authRequired magic in action.
//
// UI BUILDING BLOCKS YOU'LL REUSE EVERYWHERE:
//   Card/CardHeader/CardTitle/CardContent → the white rounded panel
//   Separator → the thin divider line
//   Grid rows (grid grid-cols-1 sm:grid-cols-3) → label | value layout
//   `{!!user.email && (...)}` → render this row ONLY if email exists
//
// WHAT'S SAT/UNSAT FOR ECO PULSE:
//   - "Your Plan", "Credits", "Buy More Credits", "Manage Payment Details"
//     → all payment features: DELETE when you strip payments.
//   - "About" section ("I'm a cool customer.") → replace with the user's
//     Eco Pulse profile: points! streak! impact! (You'll compute these from
//     approved submissions — see the leaderboard logic later.)
//   - The Email address + Username rows → KEEP as the skeleton.
// ═══════════════════════════════════════════════════════════════════════════
import { getCustomerPortalUrl, useQuery } from "wasp/client/operations"; // 🔥 payment — remove later
import { Link as WaspRouterLink, routes } from "wasp/client/router"; // 🔥 only if BuyMoreButton stays
import type { User } from "wasp/entities";
import { Button } from "../client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../client/components/ui/card";
import { Separator } from "../client/components/ui/separator";
import {
  PaymentPlanId, // 🔥 payment — remove later
  SubscriptionStatus, // 🔥 payment
  parsePaymentPlanId, // 🔥 payment
  prettyPaymentPlanName, // 🔥 payment
} from "../payment/plans";

// NOTE: `user` isn't fetched here — Wasp hands it to us (authRequired route).
export function AccountPage({ user }: { user: User }) {
  return (
    <div className="mt-10 px-6">
      <Card className="mb-4 lg:m-8">
        <CardHeader>
          <CardTitle className="text-foreground text-base font-semibold leading-6">
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            <Separator />
            {/* `{!!x && ...}` = IF x is truthy, render this block */}
            {!!user.name && (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <div className="text-muted-foreground text-sm font-medium">
                    Name
                  </div>
                  <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {user.name}
                  </div>
                </div>
              </div>
            )}
            {!!user.email && (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <div className="text-muted-foreground text-sm font-medium">
                    Email address
                  </div>
                  <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {user.email}
                  </div>
                </div>
              </div>
            )}
            {!!user.username && (
              <>
                <Separator />
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                    <div className="text-muted-foreground text-sm font-medium">
                      Username
                    </div>
                    <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                      {user.username}
                    </div>
                  </div>
                </div>
              </>
            )}
            <Separator />
            {!!user.grade && (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <div className="text-muted-foreground text-sm font-medium">
                    Grade
                  </div>
                  <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {user.grade}
                  </div>
                </div>
              </div>
              
            )}
            <Separator />
            {!!user.points && (
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-4">
                  <div className="text-muted-foreground text-sm font-medium">
                    Points
                  </div>
                  <div className="text-foreground mt-1 text-sm sm:col-span-2 sm:mt-0">
                    {user.points}
                  </div>
                </div>
              </div>
              
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Payment helpers (all 🔥 DELETE with the payment module) ────────────────
function UserCurrentSubscriptionPlan({
  subscriptionPlan,
  subscriptionStatus,
  datePaid,
}: Pick<User, "subscriptionPlan" | "subscriptionStatus" | "datePaid">) {
  let subscriptionPlanMessage = "Free Plan";
  if (
    subscriptionPlan !== null &&
    subscriptionStatus !== null &&
    datePaid !== null
  ) {
    subscriptionPlanMessage = formatSubscriptionStatusMessage(
      parsePaymentPlanId(subscriptionPlan),
      datePaid,
      subscriptionStatus as SubscriptionStatus,
    );
  }

  return (
    <>
      <div className="text-foreground mt-1 text-sm sm:col-span-1 sm:mt-0">
        {subscriptionPlanMessage}
      </div>
      <div className="ml-auto mt-4 sm:mt-0">
        <CustomerPortalButton />
      </div>
    </>
  );
}

function formatSubscriptionStatusMessage(
  subscriptionPlan: PaymentPlanId,
  datePaid: Date,
  subscriptionStatus: SubscriptionStatus,
): string {
  const paymentPlanName = prettyPaymentPlanName(subscriptionPlan);
  // A config-table pattern: map status → human message:
  const statusToMessage: Record<SubscriptionStatus, string> = {
    active: `${paymentPlanName}`,
    past_due: `Payment for your ${paymentPlanName} plan is past due! Please update your subscription payment information.`,
    cancel_at_period_end: `Your ${paymentPlanName} plan subscription has been canceled, but remains active until the end of the current billing period: ${prettyPrintEndOfBillingPeriod(
      datePaid,
    )}`,
    deleted: `Your previous subscription has been canceled and is no longer active.`,
  };

  if (!statusToMessage[subscriptionStatus]) {
    throw new Error(`Invalid subscription status: ${subscriptionStatus}`);
  }

  return statusToMessage[subscriptionStatus];
}

// Date math: billing period "runs to the end of next month, clamped to the
// day of the original payment" — look out for Jan 31-style edge cases.
function prettyPrintEndOfBillingPeriod(datePaid: Date) {
  const lastDayOfNextMonth = new Date(datePaid);
  lastDayOfNextMonth.setMonth(lastDayOfNextMonth.getMonth() + 2, 0);
  // Clamped so e.g., Jan 31 + 1 month → Feb 28, not until March 3.
  const clampedDayOfMonth = Math.min(
    datePaid.getDate(),
    lastDayOfNextMonth.getDate(),
  );
  const endOfBillingPeriod = new Date(datePaid);
  endOfBillingPeriod.setMonth(
    endOfBillingPeriod.getMonth() + 1,
    clampedDayOfMonth,
  );
  return endOfBillingPeriod.toLocaleDateString();
}

// Calls a Wasp query from the client: useQuery(getCustomerPortalUrl) → data
// loads async; isLoading while it fetches. THE bread-and-butter client read.
function CustomerPortalButton() {
  const { data: customerPortalUrl, isLoading: isCustomerPortalUrlLoading } =
    useQuery(getCustomerPortalUrl);

  if (!customerPortalUrl) {
    return null;
  }

  return (
    <a href={customerPortalUrl} target="_blank" rel="noopener noreferrer">
      <Button disabled={isCustomerPortalUrlLoading} variant="link">
        Manage Payment Details
      </Button>
    </a>
  );
}

function BuyMoreButton({
  subscriptionStatus,
}: Pick<User, "subscriptionStatus">) {
  if (
    subscriptionStatus === SubscriptionStatus.Active ||
    subscriptionStatus === SubscriptionStatus.CancelAtPeriodEnd
  ) {
    return null; // active users don't need a "buy more" link
  }

  return (
    <WaspRouterLink
      to={routes.PricingPageRoute.to}
      className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
    >
      <Button variant="link">Buy More Credits</Button>
    </WaspRouterLink>
  );
}