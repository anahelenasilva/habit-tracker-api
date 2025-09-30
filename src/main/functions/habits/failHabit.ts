import 'reflect-metadata';

import { FailHabitController } from '@application/controllers/habits/FailHabitController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(FailHabitController);
