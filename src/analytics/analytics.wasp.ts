import { job, query, type Spec } from "@wasp.sh/spec";

import { getDailyStats } from "./operations" with { type: "ref" };
import { calculateDailyStatsJob } from "./stats" with { type: "ref" };

export const analyticsSpec: Spec = [
  query(getDailyStats, { entities: ["User", "DailyStats"] }),
  job(calculateDailyStatsJob, {
    executor: "PgBoss",
    schedule: {
      cron: ""
    },
    entities: ["User", "DailyStats", "Logs", "PageViewSource"],
  }),
];
