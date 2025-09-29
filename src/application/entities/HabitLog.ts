import KSUID from 'ksuid';

export class HabitLog {
  readonly id: string;
  readonly habitId: string;
  readonly accountId: string;
  readonly date: string; // YYYY-MM-DD format
  readonly status: HabitLog.Status;
  readonly createdAt: Date;

  constructor(attr: HabitLog.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.habitId = attr.habitId;
    this.accountId = attr.accountId;
    this.date = attr.date;
    this.status = attr.status;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace HabitLog {
  export type Attributes = {
    id?: string;
    habitId: string;
    accountId: string;
    date: string;
    status: HabitLog.Status;
    createdAt?: Date;
  };

  export enum Status {
    COMPLETED = 'completed',
    FAILED = 'failed',
  }
}
