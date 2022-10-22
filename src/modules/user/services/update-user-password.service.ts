import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { UserRepositoryInterface } from '../repositories/user/user.interface.repository';
import { IUpdateUserPassword } from '../dtos/update-user-password.interface';
import { hash } from 'bcryptjs';

export class UpdateUserPasswordService {
  private readonly logger = new Logger(UpdateUserPasswordService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(data: IUpdateUserPassword): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a user password...');

      this.logger.log('Validating fields...');

      const { password, id } = data;

      const user = await this.userRepository.findOneById(id);

      if (!user) {
        throw new RpcException('Usuário não encontrado!');
      }

      user.password = await hash(password, 10);

      await this.userRepository.update(user);

      this.logger.log(`User updated! Email: ${user.email}`);

      return {
        success: true,
        message: 'User updated!',
        details: {
          user_id: user.id,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
