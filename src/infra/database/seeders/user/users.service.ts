import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { Repository } from 'typeorm';
import { users } from './data';

/**
 * Service dealing with language based operations.
 *
 * @class
 */
@Injectable()
export class UserSeederService {
  /**
   * Create an instance of class.
   *
   * @constructs
   *
   * @param {Repository<User>} userRepository
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  /**
   * Seed all users.
   *
   * @function
   */
  create(): Array<Promise<User>> {
    return users.map(async (user: IUser) => {
      return await this.userRepository
        .findOneBy({ email: user.email })
        .then(async (dbUser) => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbUser) {
            return Promise.resolve(null);
          }
          const createUser = this.userRepository.create(user);
          return Promise.resolve(await this.userRepository.save(createUser));
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
