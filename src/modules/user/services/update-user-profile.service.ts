import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { UserRepositoryInterface } from '../repositories/user/user.interface.repository';
import { IUpdateUserProfile } from '../dtos/update-user-profile.interface';

export class UpdateUserProfileService {
  private readonly logger = new Logger(UpdateUserProfileService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute(data: IUpdateUserProfile): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a user...');

      this.logger.log('Validating fields...');

      const { email, id } = data;

      const userAlreadyCreated = await this.userRepository.findOneByCondition({
        email,
      });

      if (userAlreadyCreated) {
        throw new RpcException('Este e-mail já está cadastrado.');
      }

      const user = await this.userRepository.findOneById(id);

      if (!user) {
        throw new RpcException('Usuário não encontrado!');
      }

      user.email = email;

      await this.userRepository.update(user);

      this.logger.log(`User updated! Email: ${email}`);

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
