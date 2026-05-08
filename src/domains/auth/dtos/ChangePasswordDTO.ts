import { z } from 'zod';

export const ChangePasswordDTOSchema = z.object({
  currentPassword: z.string({ required_error: 'currentPassword is required' }).min(1, 'currentPassword is required'),
  newPassword: z.string({ required_error: 'newPassword is required' }).min(8, 'newPassword must be at least 8 characters'),
});

export type ChangePasswordDTO = z.infer<typeof ChangePasswordDTOSchema>;
