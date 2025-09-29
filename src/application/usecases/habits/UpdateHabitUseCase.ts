import { Habit } from '@application/entities/Habit';
import { HabitLog } from '@application/entities/HabitLog';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class UpdateHabitUseCase {
  constructor(private readonly habitRepository: HabitRepository) { }

  async execute(input: UpdateHabitUseCase.Input): Promise<UpdateHabitUseCase.Output> {
    const habit = await this.habitRepository.findById(input.habitId);

    if (!habit || habit.accountId !== input.accountId) {
      throw new ResourceNotFound();
    }

    const updatedHabit = habit.update({
      name: input.name,
      description: input.description,
      frequency: input.frequency,
      targetPerPeriod: input.targetPerPeriod,
    });

    await this.habitRepository.update(updatedHabit);

    return {
      id: updatedHabit.id,
      habitId: updatedHabit.id,
      accountId: updatedHabit.accountId,
      name: updatedHabit.name,
      description: updatedHabit.description,
      frequency: updatedHabit.frequency,
      date: updatedHabit.createdAt.toISOString(),
      status: HabitLog.Status.COMPLETED,
      createdAt: updatedHabit.createdAt
    };
  }
}

export namespace UpdateHabitUseCase {
  export type Input = {
    habitId: string;
    accountId: string;
    name?: string;
    description?: string;
    frequency?: Habit.Frequency;
    targetPerPeriod?: number;
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
