import z from "zod";

export const getHabitsLogsSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
