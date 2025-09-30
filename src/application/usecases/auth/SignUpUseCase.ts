import { Account } from '@application/entities/Account';
import { Profile } from '@application/entities/Profile';
import { EmailAlreadyInUse } from '@application/errors/application/EmailAlreadyInUse';
import { AccountRepository } from '@infra/database/dynamo/repositories/AccountRepository';
import { ProfileRepository } from '@infra/database/dynamo/repositories/ProfileRepository';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class SignUpUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly authGateway: AuthGateway,
  ) { }

  async execute(input: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
    const { account: accountData, profile: profileData } = input;

    // Check if email already exists
    const existingAccount = await this.accountRepository.findByEmail(accountData.email);
    if (existingAccount) {
      throw new EmailAlreadyInUse();
    }

    const account = new Account({ email: accountData.email });

    // Create user in Cognito
    const { externalId } = await this.authGateway.signUp({
      email: accountData.email,
      password: accountData.password,
      internalId: account.id,
    });

    account.externalId = externalId;

    await this.accountRepository.save(account);

    // Create profile in our database
    const profile = new Profile({
      accountId: account.id,
      name: profileData.name,
      birthDate: profileData.birthDate,
    });

    await this.profileRepository.save(profile);

    // Sign in to get tokens
    const signInResponse = await this.authGateway.signIn({
      email: accountData.email,
      password: accountData.password,
    });

    return {
      accessToken: signInResponse.accessToken,
      refreshToken: signInResponse.refreshToken,
    };
  }
}

export namespace SignUpUseCase {
  export type Input = {
    account: {
      email: string;
      password: string;
    }
    profile: {
      name: string;
      birthDate?: Date;
    }
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
