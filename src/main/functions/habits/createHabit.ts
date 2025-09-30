import 'reflect-metadata';

import { CreateHabitController } from '@application/controllers/habits/CreateHabitController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(CreateHabitController);
