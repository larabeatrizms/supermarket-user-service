import { Inject, Logger, UnauthorizedException } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { UserRepositoryInterface } from '../repositories/user/user.interface.repository';

export class FindByEmailService {
  private readonly logger = new Logger(FindByEmailService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(email: string): Promise<User | Error> {
    this.logger.log(`Searching user... email: ${email}`);

    const user = await this.userRepository.findOneByCondition({ email });

    if (!user) {
      this.logger.log('User not found.');

      return new UnauthorizedException('User not found.');
    }

    return user;
  }
}
