import z from "zod";

export const failHabitBodySchema = z.object({
  date: z.string().optional(),
});

export type FailHabitBody = z.infer<typeof failHabitBodySchema>;
