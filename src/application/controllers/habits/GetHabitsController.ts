import { Controller } from '@application/contracts/Controller';
import { Habit } from '@application/entities/Habit';
import { GetHabitsUseCase } from '@application/usecases/habits/GetHabitsUseCase';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetHabitsController extends Controller<'private', GetHabitsController.Response> {
  constructor(private readonly getHabitsUseCase: GetHabitsUseCase) {
    super();
  }

  protected async handle(request: Controller.Request<'private'>): Promise<Controller.Response<GetHabitsController.Response>> {
    const result = await this.getHabitsUseCase.execute({ accountId: request.accountId! });

    return {
      statusCode: 200,
      body: result,
    };
  }
}

export namespace GetHabitsController {
  export type Response = {
    habits: {
      id: string;
      accountId: string;
      name: string;
      description?: string;
      frequency: Habit.Frequency;
      targetPerPeriod?: number;
      createdAt: Date;
      archived?: Date;
    }[];
  };
}
