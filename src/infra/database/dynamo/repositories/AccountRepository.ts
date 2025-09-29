import { GetCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import { Account } from '@application/entities/Account';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';

import { AccountItem } from '../items/AccountItem';

@Injectable()
export class AccountRepository {

  constructor(private readonly config: AppConfig) { }

  async save(account: Account): Promise<void> {
    const item = new AccountItem(account);

    await dynamoClient.send(new PutCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Item: item,
    }));
  }

  async findById(id: string): Promise<Account | null> {
    const result = await dynamoClient.send(new GetCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: { id },
    }));

    if (!result.Item) {
      return null;
    }

    return AccountItem.fromDynamoItem(result.Item).toDomain();
  }

  async findByEmail(email: string): Promise<Account | null> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: this.config.database.dynamodb.mainTable,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }));

    const items = result.Items || [];
    if (items.length === 0) {
      return null;
    }

    return AccountItem.fromDynamoItem(items[0]).toDomain();
  }

  async findByExternalId(externalId: string): Promise<Account | null> {
    const result = await dynamoClient.send(new QueryCommand({
      TableName: this.config.database.dynamodb.mainTable,
      FilterExpression: 'externalId = :externalId',
      ExpressionAttributeValues: {
        ':externalId': externalId,
      },
    }));

    const items = result.Items || [];
    if (items.length === 0) {
      return null;
    }

    return AccountItem.fromDynamoItem(items[0]).toDomain();
  }
}
