import { Controller } from '@application/contracts/Controller';
import { DeleteHabitUseCase } from '@application/usecases/habits/DeleteHabitUseCase';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class DeleteHabitController extends Controller<'private'> {
  constructor(private readonly deleteHabitUseCase: DeleteHabitUseCase) {
    super();
  }

  protected async handle({
    accountId,
    params,
  }: DeleteHabitController.RequestType): Promise<Controller.Response> {
    const habitId = params.habitId
    await this.deleteHabitUseCase.execute({ habitId, accountId: accountId! });

    return {
      statusCode: 204,
    };
  }
}

export namespace DeleteHabitController {
  export type RequestType = Controller.Request<'private', Record<string, unknown>, DeleteHabitController.Params>;

  export type Params = {
    habitId: string
  }
}
