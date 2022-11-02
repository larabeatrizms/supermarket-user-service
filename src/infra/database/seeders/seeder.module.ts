import { Logger, Module } from '@nestjs/common';
import { PostgresDatabaseProviderModule } from 'src/shared/providers/database/postgres/provider.module';
import { Seeder } from './seeder';
import { UserSeederModule } from './user/users.module';

/**
 * Import and provide seeder classes.
 *
 * @module
 */
@Module({
  imports: [PostgresDatabaseProviderModule, UserSeederModule],
  providers: [Logger, Seeder],
})
export class SeederModule {}
