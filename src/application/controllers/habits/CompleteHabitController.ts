import { Controller } from '@application/contracts/Controller';
import { HabitLog } from '@application/entities/HabitLog';
import { CompleteHabitUseCase } from '@application/usecases/habits/CompleteHabitUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { CompleteHabitBody, completeHabitBodySchema } from './schemas/completeHabitBodySchema';

@Injectable()
@Schema(completeHabitBodySchema)
export class CompleteHabitController extends Controller<'private', CompleteHabitController.Response> {
  constructor(private readonly completeHabitUseCase: CompleteHabitUseCase) {
    super();
  }

  protected async handle({
    accountId,
    body,
    params,
  }: CompleteHabitController.RequestType): Promise<Controller.Response<CompleteHabitController.Response>> {
    const habitId = params.habitId;
    const { date } = body;

    const result = await this.completeHabitUseCase.execute({
      habitId,
      accountId: accountId!,
      date,
    });

    return {
      statusCode: 201,
      body: {
        habitLog: result,
      },
    };
  }
}

export namespace CompleteHabitController {
  export type RequestType = Controller.Request<'private', CompleteHabitBody, CompleteHabitController.Params>;

  export type Params = {
    habitId: string
  }

  export type Response = {
    habitLog: {
      id: string;
      habitId: string;
      accountId: string;
      date: string;
      status: HabitLog.Status;
      createdAt: Date;
    };
  };
}
