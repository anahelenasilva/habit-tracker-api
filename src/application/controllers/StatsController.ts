import { GetHabitStatsUseCase } from '@application/usecases/stats/GetHabitStatsUseCase';
import { GetUserStatsUseCase } from '@application/usecases/stats/GetUserStatsUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

@Injectable()
export class StatsController {
  constructor(
    private readonly getHabitStatsUseCase: GetHabitStatsUseCase,
    private readonly getUserStatsUseCase: GetUserStatsUseCase,
  ) { }

  async getHabitStats(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const habitId = event.pathParameters?.habitId!;
    const accountId = this.getAccountIdFromEvent(event);
    const { startDate, endDate } = event.queryStringParameters || {};

    const result = await this.getHabitStatsUseCase.execute({
      habitId,
      accountId,
      startDate,
      endDate,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  async getUserStats(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const accountId = event.pathParameters?.accountId!;
    const requestAccountId = this.getAccountIdFromEvent(event);

    // Ensure user can only access their own stats
    if (accountId !== requestAccountId) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Forbidden' }),
      };
    }

    const { startDate, endDate } = event.queryStringParameters || {};

    const result = await this.getUserStatsUseCase.execute({
      accountId,
      startDate,
      endDate,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  private getAccountIdFromEvent(event: APIGatewayProxyEvent): string {
    // Extract user ID from JWT token in Authorization header
    // This is a simplified version - in production, you'd decode and validate the JWT
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    // TODO: Implement proper JWT token parsing
    // For now, return a placeholder - this should be replaced with actual JWT decoding
    return 'user-id-from-jwt';
  }
}
