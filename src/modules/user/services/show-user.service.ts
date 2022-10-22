import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { UserRepositoryInterface } from '../repositories/user/user.interface.repository';
import { IShowUser } from '../dtos/show-user.interface';
import { User } from '../entities/user.entity';

export class ShowUserService {
  private readonly logger = new Logger(ShowUserService.name);

  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async execute({ id }: IShowUser): Promise<User | Error> {
    try {
      this.logger.log(`Searching user... id: ${id}`);

      const user = await this.userRepository.findOneWithRelations({
        where: {
          id,
        },
        relations: {
          addresses: true,
          payments: true,
        },
      });

      if (!user) {
        throw new RpcException('Usuário não encontrado!');
      }

      delete user.password;

      return user;
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
