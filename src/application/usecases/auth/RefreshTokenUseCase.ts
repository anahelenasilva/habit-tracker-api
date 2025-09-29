import { InvalidRefreshToken } from '@application/errors/application/InvalidRefreshToken';
import { AuthGateway } from '@infra/gateways/AuthGateway';
import { Injectable } from '@kernel/decorators/injectable';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly authGateway: AuthGateway) { }

  async execute({ refreshToken }: RefreshTokenUseCase.Input): Promise<RefreshTokenUseCase.Output> {
    try {
      const response = await this.authGateway.refreshToken({ refreshToken });
      return response;
    } catch (error) {
      throw new InvalidRefreshToken();
    }
  }
}

export namespace RefreshTokenUseCase {
  export type Input = {
    refreshToken: string;
  }

  export type Output = {
    accessToken: string;
    refreshToken: string;
  }
}
