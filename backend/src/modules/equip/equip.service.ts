import { Injectable, NotFoundException } from '@nestjs/common';
import { EquipEntity } from './entities/equip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SearchEquipInfoDto } from './dto/searchEquipInfo.dto';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { SaveEquipInfoDto } from './dto/saveEquipInfo.dto';
import { SearchEquipInfoByDateDto } from './dto/searchEquipInfoByDate.dto';

@Injectable()
export class EquipService {
  constructor(
    @InjectRepository(EquipEntity)
    private readonly repository: Repository<EquipEntity>,
  ) {}

  async search(params: SearchEquipInfoDto) {
    let result;

    if (!params || Object.keys(params).length === 0) {
      result = await this.repository.find();
    } else {
      result = await this.repository.find({ where: params });
    }

    if (!result || result.length === 0) {
      throw new NotFoundException('Not found');
    }

    return {
      statusCode: 200,
      message: `Success in fetch data`,
      data: result,
    };
  }

  async searchAllByDate(params: SearchEquipInfoByDateDto) {
    const result = await this.repository.find({
      where: {
        timestamp: Between(params.initialDate, params.finalDate),
      },
    });
    if (!result || result.length === 0) {
      throw new NotFoundException(`Not found`);
    }

    return {
      statusCode: 200,
      message: `Success in the search using date params`,
      data: result,
    };
  }

  async save(saveEquipInfoDto: SaveEquipInfoDto) {
    const equip = this.repository.create(saveEquipInfoDto);
    const result = await this.repository.save(equip);

    return {
      statusCode: 200,
      message: `Success saving data`,
      data: result,
    };
  }

  async updateFromCsv(filePath: string) {
    const results: SaveEquipInfoDto[] = [];

    return new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          results.push({
            equipmentId: data.equipmentId,
            timestamp: new Date(data.timestamp),
            value: parseFloat(data.value),
          });
        })
        .on('end', async () => {
          for (const dto of results) {
            const existingEquip = await this.repository.findOne({
              where: { equipmentId: dto.equipmentId },
            });
            if (existingEquip) {
              existingEquip.timestamp = dto.timestamp;
              existingEquip.value = dto.value;
              await this.repository.save(existingEquip);
            } else {
              await this.repository.save(dto);
            }
          }
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
}
