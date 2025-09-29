import z from "zod";

export const completeHabitBodySchema = z.object({
  date: z.string().optional(),
});

export type CompleteHabitBody = z.infer<typeof completeHabitBodySchema>;
