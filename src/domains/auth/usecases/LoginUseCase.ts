import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDTO } from '../dtos/LoginDTO';
import { AppError, UnauthorizedError } from '../../../shared/errors/AppError';
import { environment } from '../../../config/environment';

@injectable()
export class LoginUseCase {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  async execute(input: LoginDTO): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      environment.jwtSecret,
      { expiresIn: '8h' },
    );

    return { token };
  }
}
