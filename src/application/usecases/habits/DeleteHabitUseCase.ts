import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class DeleteHabitUseCase {
  constructor(private readonly habitRepository: HabitRepository) { }

  async execute(input: DeleteHabitUseCase.Input): Promise<DeleteHabitUseCase.Output> {
    const habit = await this.habitRepository.findById(input.habitId);

    if (!habit || habit.accountId !== input.accountId) {
      throw new ResourceNotFound();
    }

    await this.habitRepository.delete(input.habitId);
  }
}

export namespace DeleteHabitUseCase {
  export type Input = {
    habitId: string;
    accountId: string;
  }

  export type Output = void
}
