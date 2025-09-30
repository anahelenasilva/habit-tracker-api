import 'reflect-metadata';

import { UpdateHabitController } from '@application/controllers/habits/UpdateHabitController';
import { lambdaHttpAdapter } from '@main/adapter/lambdaHttpAdapter';

export const handler = lambdaHttpAdapter(UpdateHabitController);
