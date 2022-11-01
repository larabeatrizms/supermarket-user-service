import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './controllers/user.controller';

import { SignInService } from './services/sign-in.service';
import { ShowUserService } from './services/show-user.service';
import { CreateUserService } from './services/create-user.service';
import { UpdateUserProfileService } from './services/update-user-profile.service';
import { UpdateUserAddressService } from './services/update-user-address.service';
import { FindByEmailService } from './services/find-by-email.service';

import { UserPaymentRepository } from './repositories/user-payment/user-payment.repository';
import { UserAddressRepository } from './repositories/user-address/user-address.repository';
import { UserRepository } from './repositories/user/user.repository';

import { User } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';
import { UserPayment } from './entities/user-payment.entity';
import { UpdateUserPasswordService } from './services/update-user-password.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAddress, UserPayment]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `amqp://${configService.get('RABBIT_HOST')}`,
        exchanges: [
          {
            name: 'event.exchange',
            type: 'topic',
          },
        ],
      }),
    }),
  ],
  providers: [
    FindByEmailService,
    SignInService,
    CreateUserService,
    ShowUserService,
    UpdateUserProfileService,
    UpdateUserAddressService,
    UpdateUserPasswordService,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
    {
      provide: 'UserAddressRepositoryInterface',
      useClass: UserAddressRepository,
    },
    {
      provide: 'UserPaymentRepositoryInterface',
      useClass: UserPaymentRepository,
    },
  ],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
