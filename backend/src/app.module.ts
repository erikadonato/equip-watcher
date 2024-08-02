import { Module } from '@nestjs/common';
import { EquipModule } from 'src/modules/equip/equip.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, EquipModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
