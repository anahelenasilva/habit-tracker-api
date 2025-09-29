import { HabitLog } from '@application/entities/HabitLog';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { HabitLogRepository } from '@infra/database/dynamo/repositories/HabitLogRepository';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class CompleteHabitUseCase {
  constructor(
    private readonly habitRepository: HabitRepository,
    private readonly habitLogRepository: HabitLogRepository,
  ) { }

  async execute(input: CompleteHabitUseCase.Input): Promise<CompleteHabitUseCase.Output> {
    const habit = await this.habitRepository.findById(input.habitId);

    if (!habit || habit.accountId !== input.accountId) {
      throw new ResourceNotFound();
    }

    const date = input.date || new Date().toISOString().split('T')[0];

    // Check if already logged for this date
    const existingLog = await this.habitLogRepository.findByHabitIdAndDate(input.habitId, date);

    if (existingLog) {
      return { id: existingLog.id, habitId: existingLog.habitId, accountId: existingLog.accountId, date: existingLog.date, status: existingLog.status, createdAt: existingLog.createdAt };
    }

    const habitLog = new HabitLog({
      habitId: input.habitId,
      accountId: input.accountId,
      date,
      status: HabitLog.Status.COMPLETED,
    });

    await this.habitLogRepository.save(habitLog);

    return { id: habitLog.id, habitId: habitLog.habitId, accountId: habitLog.accountId, date: habitLog.date, status: habitLog.status, createdAt: habitLog.createdAt };
  }
}

export namespace CompleteHabitUseCase {
  export type Input = {
    habitId: string;
    accountId: string;
    date?: string; // YYYY-MM-DD format, defaults to today}
  }

  export type Output = {
    id: string;
    habitId: string;
    accountId: string;
    date: string; // YYYY-MM-DD format
    status: HabitLog.Status;
    createdAt: Date;
  }
}
