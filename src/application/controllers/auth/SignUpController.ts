import { Controller } from '@application/contracts/Controller';
import { SignUpUseCase } from '@application/usecases/auth/SignUpUseCase';
import { Injectable } from '@kernel/decorators/injectable';
import { Schema } from '@kernel/decorators/schema';
import { z } from 'zod';

export const signUpSchema = z.object({
    account: z.object({
        password: z.string({ message: 'Password should be a string' }).min(8, 'Password should be at least 8 characters long'),
        email: z.string().email({ message: 'Invalid email' }).min(1, 'Email is required'),
    }),
    profile: z.object({
        name: z.string({ message: 'Name should be a string' }).min(1, '"name" is required'),
        birthDate: z.string({ message: '"birthDate" should be a valid date string (YYYY-MM-DD)' })
            .min(1, '"birthDate" is required')
            .transform((date) => new Date(date)),
    }),
});

@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<'public', any> {
    constructor(
        private readonly signUpUseCase: SignUpUseCase,
    ) {
        super();
    }

    protected async handle(request: Controller.Request<'public'>): Promise<Controller.Response<any>> {
        const typedBody = request.body as {
            account: {
                password: string;
                email: string;
            };
            profile: {
                name: string;
                birthDate: Date;
            };
        };

        const result = await this.signUpUseCase.execute(typedBody);

        return {
            statusCode: 201,
            body: result,
        };
    }
}
