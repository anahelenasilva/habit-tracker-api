import { CompleteHabitController } from '@application/controllers/habits/CompleteHabitController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(CompleteHabitController);
