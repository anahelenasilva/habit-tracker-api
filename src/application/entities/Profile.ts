import KSUID from 'ksuid';

export class Profile {
  readonly id: string;
  readonly accountId: string;
  readonly name: string;
  readonly birthDate?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(attr: Profile.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.name = attr.name;
    this.birthDate = attr.birthDate;
    this.createdAt = attr.createdAt ?? new Date();
    this.updatedAt = attr.updatedAt ?? new Date();
  }

  update(updates: Partial<Pick<Profile.Attributes, 'name' | 'birthDate'>>): Profile {
    return new Profile({
      ...this,
      ...updates,
      updatedAt: new Date(),
    });
  }
}

export namespace Profile {
  export type Attributes = {
    id?: string;
    accountId: string;
    name: string;
    birthDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
