import { BaseInterfaceRepository } from '../../../../repositories/base/base.interface.repository';
import { UserPayment } from '../../entities/user-payment.entity';

export type UserPaymentRepositoryInterface =
  BaseInterfaceRepository<UserPayment>;
