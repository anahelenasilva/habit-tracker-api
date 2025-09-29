import { Profile } from '@application/entities/Profile';

export class ProfileItem {
  id: string;
  accountId: string;
  name: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;

  constructor(profile: Profile) {
    this.id = profile.id;
    this.accountId = profile.accountId;
    this.name = profile.name;
    this.birthDate = profile.birthDate?.toISOString();
    this.createdAt = profile.createdAt.toISOString();
    this.updatedAt = profile.updatedAt.toISOString();
  }

  toDomain(): Profile {
    return new Profile({
      id: this.id,
      accountId: this.accountId,
      name: this.name,
      birthDate: this.birthDate ? new Date(this.birthDate) : undefined,
      createdAt: new Date(this.createdAt),
      updatedAt: new Date(this.updatedAt),
    });
  }

  static fromDynamoItem(item: Record<string, any>): ProfileItem {
    return new ProfileItem(new Profile({
      id: item.id,
      accountId: item.accountId,
      name: item.name,
      birthDate: new Date(item.birthDate),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  }
}
