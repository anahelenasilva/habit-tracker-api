import z from 'zod';

export const signInSchema = z.object({
  password: z.string({ message: 'Password should be a string' }).min(8, 'Password should be at least 8 characters long'),
  email: z.string().email({ message: 'Invalid email' }).min(1, 'Email is required'),
});

export type SignInBody = z.infer<typeof signInSchema>;
