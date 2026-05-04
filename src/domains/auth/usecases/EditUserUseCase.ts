import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { EditUserDTO } from '../dtos/EditUserDTO';
import { User } from '../entities/User';
import { NotFoundError } from '../../../shared/errors/AppError';

@injectable()
export class EditUserUseCase {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  async execute(id: string, input: EditUserDTO): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError('User not found');
    }

    const record = await this.prisma.user.update({
      where: { id },
      data: {
        ...(input.firstName !== undefined && { firstName: input.firstName }),
        ...(input.middleName !== undefined && { middleName: input.middleName }),
        ...(input.lastName !== undefined && { lastName: input.lastName }),
      },
    });

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
