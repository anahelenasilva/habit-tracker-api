import 'reflect-metadata';

import { GetHabitLogsController } from '@application/controllers/habits/GetHabitLogsController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(GetHabitLogsController);
