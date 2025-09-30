import { Account } from '@application/entities/Account';

export class AccountItem {
  static readonly type = 'Account';
  private readonly keys: AccountItem.Keys;

  constructor(private readonly attrs: AccountItem.Attributes) {
    this.keys = {
      PK: AccountItem.getPK(this.attrs.id),
      SK: AccountItem.getSK(this.attrs.id),
      GSI1PK: AccountItem.getGSI1PK(this.attrs.email),
      GSI1SK: AccountItem.getGSI1SK(this.attrs.email),
    };
  }

  static fromEntity(account: Account): AccountItem {
    return new AccountItem({
      ...account,
      createdAt: account.createdAt.toISOString(),
    });
  }

  toItem(): AccountItem.ItemType {
    return {
      ...this.attrs,
      ...this.keys,
      type: AccountItem.type,
    };
  }

  static toEntity(accountItem: AccountItem.ItemType): Account {
    return {
      id: accountItem.id,
      email: accountItem.email,
      externalId: accountItem.externalId,
      createdAt: new Date(accountItem.createdAt),
    };
  }

  static getPK(accountId: string): AccountItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): AccountItem.Keys['SK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getGSI1PK(email: string): AccountItem.Keys['GSI1PK'] {
    return `ACCOUNT#${email}`;
  }

  static getGSI1SK(email: string): AccountItem.Keys['GSI1SK'] {
    return `ACCOUNT#${email}`;
  }
}

export namespace AccountItem {
  export type Keys = {
    PK: `ACCOUNT#${string}`;
    SK: `ACCOUNT#${string}`;
    GSI1PK: `ACCOUNT#${string}`;
    GSI1SK: `ACCOUNT#${string}`;
  };

  export type Attributes = {
    id: string;
    email: string;
    externalId: string | undefined;
    createdAt: string;
  }

  export type ItemType = Keys & Attributes & { type: 'Account' };
}
