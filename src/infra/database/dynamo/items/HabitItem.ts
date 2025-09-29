import { Habit } from '@application/entities/Habit';

export class HabitItem {
  id: string;
  accountId: string;
  name: string;
  description?: string;
  frequency: Habit.Frequency;
  targetPerPeriod?: number;
  createdAt: string;
  updatedAt: string;
  archived?: string;

  constructor(habit: Habit) {
    this.id = habit.id;
    this.accountId = habit.accountId;
    this.name = habit.name;
    this.description = habit.description;
    this.frequency = habit.frequency;
    this.targetPerPeriod = habit.targetPerPeriod;
    this.createdAt = habit.createdAt.toISOString();
    this.updatedAt = habit.updatedAt.toISOString();
    this.archived = habit.archived?.toISOString();
  }

  toDomain(): Habit {
    return new Habit({
      id: this.id,
      accountId: this.accountId,
      name: this.name,
      description: this.description,
      frequency: this.frequency,
      targetPerPeriod: this.targetPerPeriod,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
      archived: this.archived ? new Date(this.archived) : undefined,
    });
  }

  static fromDynamoItem(item: Record<string, any>): HabitItem {
    const habitItem = new HabitItem(new Habit({
      id: item.id,
      accountId: item.accountId,
      name: item.name,
      description: item.description,
      frequency: item.frequency,
      targetPerPeriod: item.targetPerPeriod,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      archived: item.archived ? new Date(item.archived) : undefined,
    }));
    return habitItem;
  }
}
