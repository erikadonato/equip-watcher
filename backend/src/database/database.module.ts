import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'default',
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class DatabaseModule {}
