import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { EditUserUseCase } from '../../../domains/auth/usecases/EditUserUseCase';
import { GetUserUseCase } from '../../../domains/auth/usecases/GetUserUseCase';
import { ChangePasswordUseCase } from '../../../domains/auth/usecases/ChangePasswordUseCase';
import { DeactivateAccountUseCase } from '../../../domains/auth/usecases/DeactivateAccountUseCase';
import { EditUserDTOSchema } from '../../../domains/auth/dtos/EditUserDTO';
import { ChangePasswordDTOSchema } from '../../../domains/auth/dtos/ChangePasswordDTO';
import { ValidationError } from '../../../shared/errors/AppError';

@injectable()
export class ProfileController {
  constructor(
    @inject(EditUserUseCase) private editUserUseCase: EditUserUseCase,
    @inject(GetUserUseCase) private getUserUseCase: GetUserUseCase,
    @inject(ChangePasswordUseCase) private changePasswordUseCase: ChangePasswordUseCase,
    @inject(DeactivateAccountUseCase) private deactivateAccountUseCase: DeactivateAccountUseCase,
  ) {}

  /**
   * @openapi
   * /api/users/{id}:
   *   put:
   *     summary: Edit user profile
   *     description: Update a user's firstName, middleName, and/or lastName. At least one field must be provided. Requires a valid Bearer token.
   *     tags:
   *       - Profile
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/EditUserRequest'
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/EditUserResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized - missing or invalid Bearer token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async editUser(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = EditUserDTOSchema.safeParse(req.body);

      if (!validationResult.success) {
        throw new ValidationError(
          validationResult.error.errors.map((e: any) => e.message).join(', '),
        );
      }

      const editUserDTO = validationResult.data;

      const user = await this.editUserUseCase.execute(req.params.id, editUserDTO);

      res.status(200).json({
        message: 'User updated successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @openapi
   * /api/users/{id}:
   *   get:
   *     summary: Get user profile
   *     description: Retrieve a user's profile by ID. Requires a valid Bearer token.
   *     tags:
   *       - Profile
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The user ID
   *     responses:
   *       200:
   *         description: User retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/EditUserResponse'
   *       401:
   *         description: Unauthorized - missing or invalid Bearer token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  /**
   * @openapi
   * /api/users/{id}/password:
   *   patch:
   *     summary: Change password
   *     description: Change the authenticated user's password. Requires the current password and a new password (min 8 characters). Requires a valid Bearer token.
   *     tags:
   *       - Profile
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The user ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangePasswordRequest'
   *     responses:
   *       200:
   *         description: Password changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Password changed successfully
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized - missing or invalid Bearer token, or incorrect current password
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = ChangePasswordDTOSchema.safeParse(req.body);

      if (!validationResult.success) {
        throw new ValidationError(
          validationResult.error.errors.map((e: any) => e.message).join(', '),
        );
      }

      await this.changePasswordUseCase.execute(req.params.id, validationResult.data);

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      throw error;
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.getUserUseCase.execute(req.params.id);

      res.status(200).json({
        message: 'User retrieved successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @openapi
   * /api/users/{id}:
   *   delete:
   *     summary: Deactivate account
   *     description: Deactivates the user account by setting isActive to false. Requires a valid Bearer token.
   *     tags:
   *       - Profile
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The user ID
   *     responses:
   *       200:
   *         description: Account deactivated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Account deactivated successfully
   *       401:
   *         description: Unauthorized - missing or invalid Bearer token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  async deactivateAccount(req: Request, res: Response): Promise<void> {
    try {
      await this.deactivateAccountUseCase.execute(req.params.id);

      res.status(200).json({ message: 'Account deactivated successfully' });
    } catch (error) {
      throw error;
    }
  }
}
