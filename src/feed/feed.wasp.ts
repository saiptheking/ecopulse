import { action, page, query, route, type Spec } from "@wasp.sh/spec";

import { FeedPage } from "./FeedPage" with { type: "ref" };
import {
  createTask,
  deleteTask,
  generateGptResponse,
  getAllTasksByUser,
  getGptResponses,
  updateTask,
} from "./operations" with { type: "ref" };

export const demoAiAppSpec: Spec = [
  route("FeedRoute", "/feed", page(FeedPage, { authRequired: true })),

  query(getGptResponses, { entities: ["User", "GptResponse"] }),
  action(generateGptResponse, { entities: ["User", "Task", "GptResponse"] }),

  query(getAllTasksByUser, { entities: ["Task"] }),
  action(createTask, { entities: ["Task"] }),
  action(updateTask, { entities: ["Task"] }),
  action(deleteTask, { entities: ["Task"] }),
];
