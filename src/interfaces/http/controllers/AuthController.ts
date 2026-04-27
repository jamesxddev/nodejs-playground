import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { LoginUseCase } from '../../../domains/auth/usecases/LoginUseCase';
import { CreateUserUseCase } from '../../../domains/auth/usecases/CreateUserUseCase';
import { LoginDTOSchema } from '../../../domains/auth/dtos/LoginDTO';
import { CreateUserDTOSchema } from '../../../domains/auth/dtos/CreateUserDTO';
import { ValidationError } from '../../../shared/errors/AppError';

@injectable()
export class AuthController {
  constructor(
    @inject(LoginUseCase) private loginUseCase: LoginUseCase,
    @inject(CreateUserUseCase) private createUserUseCase: CreateUserUseCase,
  ) {}

  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: User Login
   *     description: Authenticate a user with email and password
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LoginResponse'
   *       400:
   *         description: Invalid input
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Authentication failed
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
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate input with Zod
      const validationResult = LoginDTOSchema.safeParse(req.body);

      if (!validationResult.success) {
        throw new ValidationError(
          validationResult.error.errors.map((e: any) => e.message).join(', '),
        );
      }

      const loginDTO = validationResult.data;

      // Execute login use case
      const user = await this.loginUseCase.execute(loginDTO);

      // Return response
      res.status(200).json({
        message: 'Login successful',
        user: user.toJSON(),
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     description: Create a new user account with email and password
   *     tags:
   *       - Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequest'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateUserResponse'
   *       400:
   *         description: Invalid input
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
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = CreateUserDTOSchema.safeParse(req.body);

      if (!validationResult.success) {
        throw new ValidationError(
          validationResult.error.errors.map((e: any) => e.message).join(', '),
        );
      }

      const createUserDTO = validationResult.data;

      const user = await this.createUserUseCase.execute(createUserDTO);

      res.status(201).json({
        message: 'User created successfully',
        user: user.toJSON(),
      });
    } catch (error) {
      throw error;
    }
  }
}
