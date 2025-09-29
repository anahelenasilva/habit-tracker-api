import { Account } from '@application/entities/Account';

export class AccountItem {
  id: string;
  email: string;
  externalId?: string;
  createdAt: string;

  constructor(account: Account) {
    this.id = account.id;
    this.email = account.email;
    this.externalId = account.externalId;
    this.createdAt = account.createdAt.toISOString();
  }

  toDomain(): Account {
    return new Account({
      id: this.id,
      email: this.email,
      externalId: this.externalId,
      createdAt: new Date(this.createdAt),
    });
  }

  static fromDynamoItem(item: Record<string, any>): AccountItem {
    return new AccountItem(new Account({
      id: item.id,
      email: item.email,
      externalId: item.externalId,
      createdAt: new Date(item.createdAt),
    }));
  }
}
