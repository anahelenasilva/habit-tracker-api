import { Habit } from '@application/entities/Habit';
import { HabitLog } from '@application/entities/HabitLog';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetHabitUseCase {
  constructor(
    private readonly habitRepository: HabitRepository,
  ) { }

  async execute(input: GetHabitUseCase.Input): Promise<GetHabitUseCase.Output> {
    const habit = await this.habitRepository.findById(input.habitId);

    if (!habit || habit.accountId !== input.accountId) {
      throw new ResourceNotFound();
    }

    return {
      id: habit.id,
      habitId: habit.id,
      name: habit.name,
      frequency: habit.frequency,
      description: habit.description,
      accountId: habit.accountId,
      date: habit.createdAt.toISOString(),
      status: HabitLog.Status.COMPLETED,
      createdAt: habit.createdAt
    };
  }
}

export namespace GetHabitUseCase {
  export type Input = {
    habitId: string;
    accountId: string;
  }

  export type Output = {
    id: string;
    habitId: string;
    name: string;
    frequency: Habit.Frequency;
    description?: string;
    accountId: string;
    date: string; // YYYY-MM-DD format
    status: HabitLog.Status;
    createdAt: Date;
  }
}
