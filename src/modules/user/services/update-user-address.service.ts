import { Inject, Logger } from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import { ISuccessResponse } from 'src/shared/interfaces/SuccessResponse.interface';
import { IUpdateUserAddress } from '../dtos/update-user-address.interface';
import { UserAddressRepositoryInterface } from '../repositories/user-address/user-address.interface.repository';

export class UpdateUserAddressService {
  private readonly logger = new Logger(UpdateUserAddressService.name);

  constructor(
    @Inject('UserAddressRepositoryInterface')
    private readonly userAddressRepository: UserAddressRepositoryInterface,
  ) {}

  async execute(data: IUpdateUserAddress): Promise<ISuccessResponse | Error> {
    try {
      this.logger.log('Updating a userAddress...');

      this.logger.log('Validating fields...');

      const { id } = data;

      const userAddress = await this.userAddressRepository.findOneById(id);

      if (!userAddress) {
        throw new RpcException('Endereço de usuário não encontrado!');
      }

      userAddress.street = data.street;
      userAddress.postalCode = data.postalCode;
      userAddress.number = data.number;
      userAddress.city = data.city;
      userAddress.state = data.state;
      userAddress.neighborhood = data.neighborhood;
      userAddress.complement = data.complement;

      await this.userAddressRepository.update(userAddress);

      this.logger.log(
        `UserAddress updated! Address: ${userAddress.street}, ${userAddress.number} - ${userAddress.postalCode} - ${userAddress.city}/${userAddress.state}`,
      );

      return {
        success: true,
        message: 'User updated!',
        details: {
          user_address_id: userAddress.id,
        },
      };
    } catch (error) {
      this.logger.error(error, error.stack);
      throw new RpcException(error?.message || error);
    }
  }
}
