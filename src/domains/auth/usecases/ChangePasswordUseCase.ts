import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from '../dtos/ChangePasswordDTO';
import { NotFoundError, UnauthorizedError } from '../../../shared/errors/AppError';

@injectable()
export class ChangePasswordUseCase {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  async execute(id: string, input: ChangePasswordDTO): Promise<void> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await bcrypt.compare(input.currentPassword, existing.password);
    if (!isMatch) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }
}
