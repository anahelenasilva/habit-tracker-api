import { DeleteCommand, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { Habit } from "@application/entities/Habit";
import { dynamoClient } from "@infra/clients/dynamoClient";
import { Injectable } from "@kernel/decorators/injectable";
import { AppConfig } from "@shared/config/AppConfig";

import { HabitItem } from "../items/HabitItem";

@Injectable()
export class HabitRepository {

  constructor(private readonly config: AppConfig) { }

  async save(habit: Habit): Promise<void> {
    const item = new HabitItem(habit);

    await dynamoClient.send(new PutCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Item: item,
    }));
  }

  async findById(id: string): Promise<Habit | null> {
    const result = await dynamoClient.send(new GetCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: { id },
    }));

    if (!result.Item) {
      return null;
    }

    return HabitItem.fromDynamoItem(result.Item).toDomain();
  }

  async findByAccountId(accountId: string): Promise<Habit[]> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: this.config.database.dynamodb.mainTable,
      IndexName: 'AccountIdIndex',
      KeyConditionExpression: 'accountId = :accountId',
      ExpressionAttributeValues: {
        ':accountId': accountId,
      },
      FilterExpression: 'attribute_not_exists(archived)',
    }));

    return (result.Items || []).map(item =>
      HabitItem.fromDynamoItem(item).toDomain()
    );
  }

  async update(habit: Habit): Promise<void> {
    const item = new HabitItem(habit);

    await dynamoClient.send(new UpdateCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: { id: habit.id },
      UpdateExpression: 'SET #name = :name, description = :description, frequency = :frequency, targetPerPeriod = :targetPerPeriod, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': item.name,
        ':description': item.description,
        ':frequency': item.frequency,
        ':targetPerPeriod': item.targetPerPeriod,
        ':updatedAt': item.updatedAt,
      },
    }));
  }

  async delete(id: string): Promise<void> {
    await dynamoClient.send(new DeleteCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: { id },
    }));
  }

  async archive(habit: Habit): Promise<void> {
    const archivedHabit = habit.archive();
    const item = new HabitItem(archivedHabit);

    await dynamoClient.send(new UpdateCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: { id: habit.id },
      UpdateExpression: 'SET archived = :archived, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':archived': item.archived,
        ':updatedAt': item.updatedAt,
      },
    }));
  }
}
