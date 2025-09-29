import { Controller } from '@application/contracts/Controller';
import { Habit } from '@application/entities/Habit';
import { UpdateHabitUseCase } from '@application/usecases/habits/UpdateHabitUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { HabitLog } from '@application/entities/HabitLog';
import { updateHabitSchema } from './schemas/updateHabitSchema';

@Injectable()
@Schema(updateHabitSchema)
export class UpdateHabitController extends Controller<'private', UpdateHabitController.Response> {
  constructor(private readonly updateHabitUseCase: UpdateHabitUseCase) {
    super();
  }

  protected async handle({
    accountId,
    body,
    params,
  }: UpdateHabitController.RequestType): Promise<Controller.Response<UpdateHabitController.Response>> {
    const habitId = params.habitId;
    const result = await this.updateHabitUseCase.execute({
      ...body,
      habitId,
      accountId
    });

    return {
      statusCode: 200,
      body: { habit: result },
    };
  }
}

export namespace UpdateHabitController {
  export type RequestType = Controller.Request<'private', Record<string, unknown>, UpdateHabitController.Params>;

  export type Params = {
    habitId: string
  }

  export type Response = {
    habit: {
      id: string;
      habitId: string;
      name: string;
      frequency: Habit.Frequency;
      description?: string;
      accountId: string;
      date: string; // YYYY-MM-DD format
      status: HabitLog.Status;
      createdAt: Date;
    };
  };
}
