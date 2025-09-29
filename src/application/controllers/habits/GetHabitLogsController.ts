import { Controller } from '@application/contracts/Controller';
import { GetHabitLogsUseCase } from '@application/usecases/habits/GetHabitLogsUseCase';
import { Injectable } from '@kernel/decorators/injectable';

import { getHabitsLogsSchema } from './schemas/getHabitsLogsSchema';

@Injectable()
export class GetHabitLogsController extends Controller<'private', GetHabitLogsController.Response> {
  constructor(private readonly getHabitLogsUseCase: GetHabitLogsUseCase) {
    super();
  }

  protected async handle({
    accountId,
    params,
    queryParams,
  }: GetHabitLogsController.RequestType): Promise<Controller.Response<GetHabitLogsController.Response>> {
    const habitId = params.habitId;
    const { startDate, endDate } = getHabitsLogsSchema.parse(queryParams);

    const result = await this.getHabitLogsUseCase.execute({
      habitId,
      accountId: accountId!,
      startDate,
      endDate,
    });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetHabitLogsController {
  export type RequestType = Controller.Request<'private', Record<string, unknown>, GetHabitLogsController.Params>;

  export type Params = {
    habitId: string
  }

  export type Response = {
    logs: {
      id: string;
      habitId: string;
      accountId: string;
      date: string;
      status: 'completed' | 'failed';
      createdAt: Date;
    }[];
  };
}
