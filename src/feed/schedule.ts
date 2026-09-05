import * as z from "zod";

export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export const taskPrioritySchema = z.enum(["low", "medium", "high"]);

export type Task = z.infer<typeof taskSchema>;
export const taskSchema = z.object({
  name: z.string().describe("Name of main task provided by user"),
  priority: taskPrioritySchema.optional().describe("task priority"),
  description: z
    .string()
    .optional()
    .describe("Optional description of the task / challenge"),
  time: z
    .number()
    .optional()
    .describe("Optional time allocated for this task in hours, e.g. 0.5"),
});

export type TaskItem = z.infer<typeof taskItemSchema>;
export const taskItemSchema = z.object({
  description: z
    .string()
    .describe(
      'detailed breakdown and description of sub-task related to main task. e.g., "Prepare your learning session by first reading through the documentation"',
    ),
  time: z
    .number()
    .describe("time allocated for a given subtask in hours, e.g. 0.5"),
  taskName: z.string().describe("name of main task related to subtask"),
});

export type GeneratedSchedule = z.infer<typeof generatedScheduleSchema>;
export const generatedScheduleSchema = z.object({
  tasks: taskSchema
    .array()
    .describe("Name of main tasks provided by user, ordered by priority"),
  taskItems: taskItemSchema
    .array()
    .optional()
    .describe(
      "OPTIONAL: detailed breakdown and description of sub-tasks related to main tasks. Eco Pulse doesn't need this — you can omit it.",
    ),
});
