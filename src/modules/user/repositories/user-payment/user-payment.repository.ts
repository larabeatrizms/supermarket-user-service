import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.abstract.repository';
import { UserPaymentRepositoryInterface } from './user-payment.interface.repository';
import { UserPayment } from '../../entities/user-payment.entity';

@Injectable()
export class UserPaymentRepository
  extends BaseAbstractRepository<UserPayment>
  implements UserPaymentRepositoryInterface
{
  constructor(
    @InjectRepository(UserPayment)
    private readonly repository: Repository<UserPayment>,
  ) {
    super(repository);
  }
}
