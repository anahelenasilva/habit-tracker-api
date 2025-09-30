import { GetCommand, PutCommandInput, UpdateCommand } from '@aws-sdk/lib-dynamodb';

import { Profile } from '@application/entities/Profile';
import { dynamoClient } from '@infra/clients/dynamoClient';
import { Injectable } from '@kernel/decorators/injectable';
import { AppConfig } from '@shared/config/AppConfig';

import { ProfileItem } from '../items/ProfileItem';

@Injectable()
export class ProfileRepository {
  constructor(private readonly config: AppConfig) { }

  getPutCommand(profile: Profile): PutCommandInput {
    const profileItem = ProfileItem.fromEntity(profile);

    return {
      TableName: this.config.database.dynamodb.mainTable,
      Item: profileItem.toItem(),
    };
  }

  async save(profile: Profile) {
    const profileItem = ProfileItem.fromEntity(profile).toItem();

    const command = new UpdateCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: {
        PK: profileItem.PK,
        SK: profileItem.SK,
      },
      UpdateExpression: 'SET #name = :name, #birthDate = :birthDate',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#birthDate': 'birthDate',
      },
      ExpressionAttributeValues: {
        ':name': profileItem.name,
        ':birthDate': profileItem.birthDate,
      },
      ReturnValues: 'NONE',
    });

    await dynamoClient.send(command);
  }

  async findByAccountId({ accountId }: ProfileRepository.FindByAccountIdParams): Promise<Profile | null> {
    const command = new GetCommand({
      TableName: this.config.database.dynamodb.mainTable,
      Key: {
        PK: ProfileItem.getPK(accountId),
        SK: ProfileItem.getSK(accountId),
      },
    });

    const { Item: profileItem } = await dynamoClient.send(command);

    if (!profileItem) {
      return null;
    }

    return ProfileItem.toEntity(profileItem as ProfileItem.ItemType);
  }
}

export namespace ProfileRepository {
  export type FindByAccountIdParams = {
    accountId: string;
  }
}
