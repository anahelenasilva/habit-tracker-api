import { Controller } from '@application/contracts/Controller';
import { Habit } from '@application/entities/Habit';
import { GetHabitUseCase } from '@application/usecases/habits/GetHabitUseCase';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetHabitController extends Controller<'private', GetHabitController.Response> {
  constructor(private readonly getHabitUseCase: GetHabitUseCase) {
    super();
  }

  protected async handle({
    accountId,
    params,
  }: GetHabitController.RequestType): Promise<Controller.Response<GetHabitController.Response>> {
    const habitId = params.habitId;
    const result = await this.getHabitUseCase.execute({ habitId, accountId: accountId! });

    return {
      statusCode: 200,
      body: {
        habit: result,
      },
    };
  }
}

export namespace GetHabitController {
  export type RequestType = Controller.Request<'private', Record<string, unknown>, GetHabitController.Params>;

  export type Params = {
    habitId: string
  }

  export type Response = {
    habit: {
      id: string;
      accountId: string;
      name: string;
      description?: string;
      frequency: Habit.Frequency;
      targetPerPeriod?: number;
      createdAt: Date;
      archived?: Date;
    };
  };
}
