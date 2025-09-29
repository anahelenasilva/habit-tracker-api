import { Habit } from '@application/entities/Habit';
import { HabitLog } from '@application/entities/HabitLog';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetHabitsUseCase {
  constructor(private readonly habitRepository: HabitRepository) { }

  async execute(input: GetHabitsUseCase.Input): Promise<GetHabitsUseCase.Output> {
    const habits = await this.habitRepository.findByAccountId(input.accountId);
    const mappedHabits = habits.map(habit => ({
      id: habit.id,
      habitId: habit.id,
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      accountId: habit.accountId,
      date: habit.createdAt.toISOString(),
      status: HabitLog.Status.COMPLETED,
      createdAt: habit.createdAt,
    }));

    return { habits: mappedHabits };
  }
}

export namespace GetHabitsUseCase {
  export type Input = {
    accountId: string;
  }

  export type Output = {
    habits: {
      id: string;
      habitId: string;
      name: string;
      frequency: Habit.Frequency;
      description?: string;
      accountId: string;
      date: string; // YYYY-MM-DD format
      status: HabitLog.Status;
      createdAt: Date;
    }[]
  }
}
