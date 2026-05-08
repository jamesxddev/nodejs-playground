import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../../../shared/errors/AppError';

@injectable()
export class DeactivateAccountUseCase {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  async execute(id: string): Promise<void> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
