import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { EditUserUseCase } from '../../../domains/auth/usecases/EditUserUseCase';
import { GetUserUseCase } from '../../../domains/auth/usecases/GetUserUseCase';
import { EditUserDTOSchema } from '../../../domains/auth/dtos/EditUserDTO';
import { ValidationError } from '../../../shared/errors/AppError';

@injectable()
export class ProfileController {
  constructor(
    @inject(EditUserUseCase) private editUserUseCase: EditUserUseCase,
    @inject(GetUserUseCase) private getUserUseCase: GetUserUseCase,
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
}
