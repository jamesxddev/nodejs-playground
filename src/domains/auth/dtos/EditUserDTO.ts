import { z } from 'zod';

export const EditUserDTOSchema = z
  .object({
    firstName: z.string().min(1, 'First name cannot be empty').optional(),
    middleName: z.string().optional(),
    lastName: z.string().min(1, 'Last name cannot be empty').optional(),
  })
  .refine(
    (data) => data.firstName !== undefined || data.middleName !== undefined || data.lastName !== undefined,
    { message: 'At least one field (firstName, middleName, lastName) must be provided' },
  );

export type EditUserDTO = z.infer<typeof EditUserDTOSchema>;
