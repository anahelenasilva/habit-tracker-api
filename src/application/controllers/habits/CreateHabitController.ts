import { Controller } from '@application/contracts/Controller';
import { Habit } from '@application/entities/Habit';
import { CreateHabitUseCase } from '@application/usecases/habits/CreateHabitUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';

import { CreateHabitBody, createHabitBodySchema } from './schemas/createHabitSchema';

@Injectable()
@Schema(createHabitBodySchema)
export class CreateHabitController extends Controller<'private', any> {
  constructor(private readonly createHabitUseCase: CreateHabitUseCase) {
    super();
  }

  protected async handle(request: Controller.Request<'private', CreateHabitBody>): Promise<Controller.Response<CreateHabitController.Response>> {
    const habit = await this.createHabitUseCase.execute({
      ...request.body,
      accountId: request.accountId!,
    });

    return {
      statusCode: 201,
      body: { habit },
    };
  }
}

export namespace CreateHabitController {
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
    }
  }
}
