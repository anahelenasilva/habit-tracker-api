import KSUID from 'ksuid';

export class Habit {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly description?: string;
  readonly frequency: Habit.Frequency;
  readonly targetPerPeriod?: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly archived?: Date;

  constructor(attr: Habit.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.description = attr.description;
    this.frequency = attr.frequency;
    this.targetPerPeriod = attr.targetPerPeriod;
    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
    this.archived = attr.archived;
  }

  update(updates: Partial<Pick<Habit.Attributes, 'name' | 'description' | 'frequency' | 'targetPerPeriod'>>): Habit {
    return new Habit({
      ...this,
      ...updates,
      updatedAt: new Date(),
    });
  }

  archive(): Habit {
    return new Habit({
      ...this,
      archived: new Date(),
      updatedAt: new Date(),
    });
  }
}

export namespace Habit {
  export type Attributes = {
    id?: string;
    accountId: string;
    name: string;
    description?: string;
    frequency: Habit.Frequency;
    targetPerPeriod?: number;
    createdAt?: Date;
    updatedAt?: Date;
    archived?: Date;
  };

  export enum Frequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
  }
}
