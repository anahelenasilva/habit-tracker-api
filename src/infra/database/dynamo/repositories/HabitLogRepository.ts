import { PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { HabitLog } from '@application/entities/HabitLog';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';

import { HabitLogItem } from '../items/HabitLogItem';

@Injectable()
export class HabitLogRepository {

  constructor(private readonly config: AppConfig) { }

  async save(habitLog: HabitLog): Promise<void> {
    const item = new HabitLogItem(habitLog);

    await dynamoClient.send(new PutCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Item: item,
    }));
  }

  async findByHabitId(habitId: string): Promise<HabitLog[]> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: this.config.database.dynamodb.mainTable,
      IndexName: 'HabitIdDateIndex',
      KeyConditionExpression: 'habitId = :habitId',
      ExpressionAttributeValues: {
        ':habitId': habitId,
      },
      ScanIndexForward: false, // Sort by date descending
    }));

    return (result.Items || []).map(item =>
      HabitLogItem.fromDynamoItem(item).toDomain()
    );
  }

  async findByHabitIdAndDateRange(habitId: string, startDate: string, endDate: string): Promise<HabitLog[]> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: this.config.database.dynamodb.mainTable,
      IndexName: 'HabitIdDateIndex',
      KeyConditionExpression: 'habitId = :habitId AND #date BETWEEN :startDate AND :endDate',
      ExpressionAttributeNames: {
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':habitId': habitId,
        ':startDate': startDate,
        ':endDate': endDate,
      },
    }));

    return (result.Items || []).map(item =>
      HabitLogItem.fromDynamoItem(item).toDomain()
    );
  }

  async findByHabitIdAndDate(habitId: string, date: string): Promise<HabitLog | null> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: this.config.database.dynamodb.mainTable,
      IndexName: 'HabitIdDateIndex',
      KeyConditionExpression: 'habitId = :habitId AND #date = :date',
      ExpressionAttributeNames: {
        '#date': 'date',
      },
      ExpressionAttributeValues: {
        ':habitId': habitId,
        ':date': date,
      },
    }));

    const items = result.Items || [];
    if (items.length === 0) {
      return null;
    }

    return HabitLogItem.fromDynamoItem(items[0]).toDomain();
  }
}
