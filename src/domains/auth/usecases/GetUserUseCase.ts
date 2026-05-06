import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { User } from '../entities/User';
import { NotFoundError } from '../../../shared/errors/AppError';

@injectable()
export class GetUserUseCase {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  async execute(id: string): Promise<User> {
    const record = await this.prisma.user.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundError('User not found');
    }

    return new User(
      record.id,
      record.email,
      record.password,
      record.firstName,
      record.middleName ?? undefined,
      record.lastName,
      record.isActive,
      record.createdAt,
      record.updatedAt,
    );
  }
}
