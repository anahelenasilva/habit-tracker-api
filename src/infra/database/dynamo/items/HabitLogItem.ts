import { HabitLog } from '@application/entities/HabitLog';

export class HabitLogItem {
  id: string;
  habitId: string;
  accountId: string;
  date: string;
  status: HabitLog.Status;
  createdAt: string;

  constructor(habitLog: HabitLog) {
    this.id = habitLog.id;
    this.habitId = habitLog.habitId;
    this.accountId = habitLog.accountId;
    this.date = habitLog.date;
    this.status = habitLog.status;
    this.createdAt = habitLog.createdAt.toISOString();
  }

  toDomain(): HabitLog {
    return new HabitLog({
      id: this.id,
      habitId: this.habitId,
      accountId: this.accountId,
      date: this.date,
      status: this.status,
      createdAt: new Date(this.createdAt),
    });
  }

  static fromDynamoItem(item: Record<string, any>): HabitLogItem {
    return new HabitLogItem(new HabitLog({
      id: item.id,
      habitId: item.habitId,
      accountId: item.accountId,
      date: item.date,
      status: item.status,
      createdAt: new Date(item.createdAt),
    }));
  }
}
