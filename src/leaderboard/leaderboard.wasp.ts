import { query, route, page, type Spec } from "@wasp.sh/spec";
import { getUserNames } from "./operations" with { type: "ref" };
import { LeaderboardPage } from "./LeaderboardPage" with { type: "ref" };

export const leaderboardSpec: Spec = [
  route("LeaderboardRoute", "/leaderboard", page(LeaderboardPage, { authRequired: true })),
  query(getUserNames, { entities: ["User"] }),

];