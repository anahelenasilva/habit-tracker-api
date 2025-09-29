import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { Profile } from '@application/entities/Profile';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';

import { ProfileItem } from '../items/ProfileItem';

@Injectable()
export class ProfileRepository {

  constructor(private readonly config: AppConfig) { }

  async save(profile: Profile): Promise<void> {
    const item = new ProfileItem(profile);

    await dynamoClient.send(new PutCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Item: item,
    }));
  }

  async findById(id: string): Promise<Profile | null> {
    const result = await dynamoClient.send(new GetCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: { id },
    }));

    if (!result.Item) {
      return null;
    }

    return ProfileItem.fromDynamoItem(result.Item).toDomain();
  }

  async findByAccountId(accountId: string): Promise<Profile | null> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: this.config.database.dynamodb.mainTable,
      IndexName: 'AccountIdIndex',
      KeyConditionExpression: 'accountId = :accountId',
      ExpressionAttributeValues: {
        ':accountId': accountId,
      },
    }));

    const items = result.Items || [];
    if (items.length === 0) {
      return null;
    }

    return ProfileItem.fromDynamoItem(items[0]).toDomain();
  }

  async update(profile: Profile): Promise<void> {
    const item = new ProfileItem(profile);

    await dynamoClient.send(new UpdateCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: { id: profile.id },
      UpdateExpression: 'SET #name = :name, birthDate = :birthDate, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': item.name,
        ':birthDate': item.birthDate,
        ':updatedAt': item.updatedAt,
      },
    }));
  }
}
