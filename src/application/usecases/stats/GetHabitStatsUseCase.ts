import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { HabitLogRepository } from '@infra/database/dynamo/repositories/HabitLogRepository';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

export type GetHabitStatsInput = {
  habitId: string;
  accountId: string;
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
};

export type GetHabitStatsOutput = {
  totalLogs: number;
  completedCount: number;
  failedCount: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
};

@Injectable()
export class GetHabitStatsUseCase {
  constructor(
    private readonly habitRepository: HabitRepository,
    private readonly habitLogRepository: HabitLogRepository,
  ) { }

  async execute(input: GetHabitStatsInput): Promise<GetHabitStatsOutput> {
    const habit = await this.habitRepository.findById(input.habitId);

    if (!habit || habit.accountId !== input.accountId) {
      throw new ResourceNotFound();
    }

    let logs;
    if (input.startDate && input.endDate) {
      logs = await this.habitLogRepository.findByHabitIdAndDateRange(
        input.habitId,
        input.startDate,
        input.endDate
      );
    } else {
      logs = await this.habitLogRepository.findByHabitId(input.habitId);
    }

    const totalLogs = logs.length;
    const completedCount = logs.filter(log => log.status === 'completed').length;
    const failedCount = logs.filter(log => log.status === 'failed').length;
    const completionRate = totalLogs > 0 ? (completedCount / totalLogs) * 100 : 0;

    // Calculate streaks
    const sortedLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const { currentStreak, longestStreak } = this.calculateStreaks(sortedLogs);

    return {
      totalLogs,
      completedCount,
      failedCount,
      completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      currentStreak,
      longestStreak,
    };
  }

  private calculateStreaks(logs: Array<{ date: string; status: 'completed' | 'failed' }>) {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Calculate from most recent date backwards for current streak
    const today = new Date().toISOString().split('T')[0];
    const recentLogs = logs.filter(log => log.date <= today).reverse();

    for (const log of recentLogs) {
      if (log.status === 'completed') {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    for (const log of logs) {
      if (log.status === 'completed') {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { currentStreak, longestStreak };
  }
}
