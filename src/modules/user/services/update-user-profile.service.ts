import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { UserRepositoryInterface } from '../repositories/user/user.interface.repository';
import { IUpdateUserProfile } from '../dtos/update-user-profile.interface';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export class UpdateUserProfileService {
  private readonly logger = new Logger(UpdateUserProfileService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async execute(data: IUpdateUserProfile): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a user...');

      this.logger.log('Validating fields...');

      const { email, id, isAdmin, userSession } = data;

      if (
        userSession.userId !== Number(id) &&
        userSession.role === 'customer'
      ) {
        throw new RpcException(
          'Usuário não tem permissão para alterar informações de outros usuários!',
        );
      }

      if (userSession.role === 'customer' && isAdmin) {
        throw new RpcException(
          'Usuário não tem permissão para alterar tipo de usuário!',
        );
      }

      const userAlreadyCreated = await this.userRepository.findOneByCondition({
        email,
      });

      if (userAlreadyCreated && userAlreadyCreated.id !== Number(id)) {
        throw new RpcException('Este e-mail já está cadastrado.');
      }

      const user = await this.userRepository.findOneById(Number(id));

      if (!user) {
        throw new RpcException('Usuário não encontrado!');
      }

      user.email = email;
      user.isAdmin = isAdmin || false;

      await this.userRepository.update(user);

      this.logger.log(`User updated! Email: ${email}`);

      this.amqpConnection.publish(
        'event.exchange',
        'event.update.user.#',
        user,
      );

      this.logger.log(
        `User created sended to RabbitMQ! routingKey: event.update.user.#`,
      );

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
