import { Habit } from '@application/entities/Habit';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CreateHabitUseCase {
  constructor(private readonly habitRepository: HabitRepository) { }

  async execute(input: CreateHabitUseCase.Input): Promise<CreateHabitUseCase.Output> {
    const habit = new Habit({
      accountId: input.accountId,
      name: input.name,
      description: input.description,
      frequency: input.frequency,
      targetPerPeriod: input.targetPerPeriod,
    });

    await this.habitRepository.save(habit);

    return {
      id: habit.id,
      accountId: habit.accountId,
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      targetPerPeriod: habit.targetPerPeriod,
      createdAt: habit.createdAt,
      archived: habit.archived,
    };
  }
}

export namespace CreateHabitUseCase {
  export type Input = {
    accountId: string;
    name: string;
    description?: string;
    frequency: Habit.Frequency;
    targetPerPeriod?: number;
  }

  export type Output = {
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
