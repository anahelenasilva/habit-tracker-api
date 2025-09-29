import { GetHabitController } from '@application/controllers/habits/GetHabitController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(GetHabitController);
