import { DeleteHabitController } from '@application/controllers/habits/DeleteHabitController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(DeleteHabitController);
