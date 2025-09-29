import { HabitLog } from '@application/entities/HabitLog';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { HabitLogRepository } from '@infra/database/dynamo/repositories/HabitLogRepository';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class GetHabitLogsUseCase {
  constructor(
    private readonly habitRepository: HabitRepository,
    private readonly habitLogRepository: HabitLogRepository,
  ) { }

  async execute(input: GetHabitLogsUseCase.Input): Promise<GetHabitLogsUseCase.Output> {
    const habit = await this.habitRepository.findById(input.habitId);

    if (!habit || habit.accountId !== input.accountId) {
      throw new ResourceNotFound();
    }

    let logs: HabitLog[];

    if (input.startDate && input.endDate) {
      logs = await this.habitLogRepository.findByHabitIdAndDateRange(
        input.habitId,
        input.startDate,
        input.endDate
      );
    } else {
      logs = await this.habitLogRepository.findByHabitId(input.habitId);
    }

    return { logs };
  }
}

export namespace GetHabitLogsUseCase {
  export type Input = {
    habitId: string;
    accountId: string;
    startDate?: string; // YYYY-MM-DD format
    endDate?: string; // YYYY-MM-DD format
  }

  export type Output = {
    logs: {
      id: string;
      habitId: string;
      accountId: string;
      date: string; // YYYY-MM-DD format
      status: HabitLog.Status;
      createdAt: Date;
    }[]
  }
}
