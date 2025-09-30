
import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { Injectable } from '@kernel/decorators/injectable';

import { AccountRepository } from '../repositories/AccountRepository';
import { ProfileRepository } from '../repositories/ProfileRepository';
import { UnitOfWork } from './UnitOfWork';

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
  ) {
    super();
  }

  async run({ account, profile }: SignUpUnitOfWork.RunParams) {
    this.addPutItem(this.accountRepository.getPutCommand(account));
    this.addPutItem(this.profileRepository.getPutCommand(profile));

    await this.commit();
  }
}

export namespace SignUpUnitOfWork {
  export type RunParams = {
    account: Account;
    profile: Profile;
  }
}
