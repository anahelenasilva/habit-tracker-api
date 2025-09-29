import z from "zod";

import { Habit } from "@application/entities/Habit";

export const createHabitBodySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  frequency: z.nativeEnum(Habit.Frequency),
  targetPerPeriod: z.number().positive().optional(),
});

export type CreateHabitBody = z.infer<typeof createHabitBodySchema>;
