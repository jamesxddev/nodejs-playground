import { injectable, inject } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { User } from '../entities/User';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
  ) {}

  async execute(input: CreateUserDTO): Promise<User> {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const record = await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        firstName: input.firstName,
        middleName: input.middleName,
        lastName: input.lastName,
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
