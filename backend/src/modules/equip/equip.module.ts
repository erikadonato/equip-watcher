import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipEntity } from './entities/equip.entity';
import { EquipController } from './equip.controller';
import { EquipService } from './equip.service';

@Module({
  providers: [EquipService],
  imports: [TypeOrmModule.forFeature([EquipEntity])],
  controllers: [EquipController],
})
export class EquipModule {}
