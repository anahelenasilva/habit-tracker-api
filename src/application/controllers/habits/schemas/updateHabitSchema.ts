import z from "zod";

export const updateHabitSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  targetPerPeriod: z.number().positive().optional(),
});

export type UpdateHabitBody = z.infer<typeof updateHabitSchema>;
