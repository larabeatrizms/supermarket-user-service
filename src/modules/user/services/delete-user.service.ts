import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { UserRepositoryInterface } from '../repositories/user/user.interface.repository';

export class DeleteUserService {
  private readonly logger = new Logger(DeleteUserService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async execute(id: number): Promise<ISuccessResponse | Error> {
    this.logger.log(`Searching user... id: ${id}`);

    const user = await this.userRepository.findOneById(id);

    if (!user) {
      this.logger.log('User not found.');

      return new BadRequestException('Usuário não encontrado!');
    }

    await this.userRepository.remove(id);

    this.logger.log('User deleted.');

    this.amqpConnection.publish('event.exchange', 'event.delete.user.#', user);

    this.logger.log(
      `User deleted sended to RabbitMQ! routingKey: event.delete.user.#`,
    );

    return {
      success: true,
      message: 'Usuário deletado!',
    };
  }
}
