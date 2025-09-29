import { Controller } from '@application/contracts/Controller';
import { HabitLog } from '@application/entities/HabitLog';
import { FailHabitUseCase } from '@application/usecases/habits/FailHabitUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { FailHabitBody, failHabitBodySchema } from './schemas/failHabitBodySchema';

@Injectable()
@Schema(failHabitBodySchema)
export class FailHabitController extends Controller<'private', FailHabitController.Response> {
  constructor(private readonly failHabitUseCase: FailHabitUseCase) {
    super();
  }

  protected async handle({
    accountId,
    body,
    params,
  }: FailHabitController.RequestType): Promise<Controller.Response<FailHabitController.Response>> {
    const habitId = params.habitId;
    const { date } = body;

    const result = await this.failHabitUseCase.execute({
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

export namespace FailHabitController {
  export type RequestType = Controller.Request<'private', FailHabitBody, FailHabitController.Params>;

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
