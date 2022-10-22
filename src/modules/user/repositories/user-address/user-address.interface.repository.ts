import { BaseInterfaceRepository } from '../../../../repositories/base/base.interface.repository';
import { UserAddress } from '../../entities/user-address.entity';

export type UserAddressRepositoryInterface =
  BaseInterfaceRepository<UserAddress>;
