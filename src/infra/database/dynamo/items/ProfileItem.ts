import { Profile } from '@application/entities/Profile';

import { AccountItem } from './AccountItem';

export class ProfileItem {
  static readonly type = 'Profile';
  private readonly keys: ProfileItem.Keys;

  constructor(private readonly attrs: ProfileItem.Attributes) {
    this.keys = {
      PK: ProfileItem.getPK(this.attrs.accountId),
      SK: ProfileItem.getSK(this.attrs.accountId),
    };
  }

  static fromEntity(profile: Profile): ProfileItem {
    return new ProfileItem({
      ...profile,
      createdAt: profile.createdAt.toISOString(),
      birthDate: profile.birthDate?.toISOString(),
    });
  }

  toItem(): ProfileItem.ItemType {
    return {
      ...this.attrs,
      ...this.keys,
      type: ProfileItem.type,
    };
  }

  static toEntity(profileItem: ProfileItem.ItemType): Profile {
    return {
      accountId: profileItem.accountId,
      name: profileItem.name,
      birthDate: profileItem.birthDate ? new Date(profileItem.birthDate) : undefined,
      createdAt: new Date(profileItem.createdAt),
    };
  }

  static getPK(accountId: string): ProfileItem.Keys['PK'] {
    return `ACCOUNT#${accountId}`;
  }

  static getSK(accountId: string): ProfileItem.Keys['SK'] {
    return `ACCOUNT#${accountId}#PROFILE`;
  }
}

export namespace ProfileItem {
  export type Keys = {
    PK: AccountItem.Keys['PK'];
    SK: `ACCOUNT#${string}#PROFILE`;
  };

  export type Attributes = {
    accountId: string;
    name: string;
    birthDate?: string;
    createdAt: string;
  }

  export type ItemType = Keys & Attributes & { type: 'Profile' };
}
