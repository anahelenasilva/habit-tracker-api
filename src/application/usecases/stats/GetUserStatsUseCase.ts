import { HabitLogRepository } from '@infra/database/dynamo/repositories/HabitLogRepository';
import { HabitRepository } from '@infra/database/dynamo/repositories/HabitRepository';
import { Injectable } from '@kernel/decorators/injectable';

export type GetUserStatsInput = {
  accountId: string;
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
};

export type GetUserStatsOutput = {
  totalHabits: number;
  activeHabits: number;
  totalLogs: number;
  completedCount: number;
  failedCount: number;
  overallCompletionRate: number;
  habitsWithStreaks: Array<{
    habitId: string;
    habitName: string;
    currentStreak: number;
    longestStreak: number;
  }>;
};

@Injectable()
export class GetUserStatsUseCase {
  constructor(
    private readonly habitRepository: HabitRepository,
    private readonly habitLogRepository: HabitLogRepository,
  ) { }

  async execute(input: GetUserStatsInput): Promise<GetUserStatsOutput> {
    const habits = await this.habitRepository.findByAccountId(input.accountId);
    const totalHabits = habits.length;
    const activeHabits = habits.filter(habit => !habit.archived).length;

    let allLogs: Array<{ habitId: string; date: string; status: 'completed' | 'failed' }> = [];
    const habitsWithStreaks = [];

    for (const habit of habits) {
      let logs;
      if (input.startDate && input.endDate) {
        logs = await this.habitLogRepository.findByHabitIdAndDateRange(
          habit.id,
          input.startDate,
          input.endDate
        );
      } else {
        logs = await this.habitLogRepository.findByHabitId(habit.id);
      }

      allLogs = allLogs.concat(logs.map(log => ({
        habitId: log.habitId,
        date: log.date,
        status: log.status,
      })));

      // Calculate streaks for this habit
      const sortedLogs = logs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const { currentStreak, longestStreak } = this.calculateStreaks(sortedLogs);

      habitsWithStreaks.push({
        habitId: habit.id,
        habitName: habit.name,
        currentStreak,
        longestStreak,
      });
    }

    const totalLogs = allLogs.length;
    const completedCount = allLogs.filter(log => log.status === 'completed').length;
    const failedCount = allLogs.filter(log => log.status === 'failed').length;
    const overallCompletionRate = totalLogs > 0 ? (completedCount / totalLogs) * 100 : 0;

    return {
      totalHabits,
      activeHabits,
      totalLogs,
      completedCount,
      failedCount,
      overallCompletionRate: Math.round(overallCompletionRate * 100) / 100,
      habitsWithStreaks,
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
