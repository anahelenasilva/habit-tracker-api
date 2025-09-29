import { GetHabitsController } from '@application/controllers/habits/GetHabitsController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(GetHabitsController);
