import { Injectable, NotFoundException } from '@nestjs/common';
import { EquipEntity } from './entities/equip.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchEquipInfoDto } from './dto/searchEquipInfo.dto';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { SaveEquipInfoDto } from './dto/saveEquipInfo.dto';

@Injectable()
export class EquipService {
  constructor(
    @InjectRepository(EquipEntity)
    private readonly repository: Repository<EquipEntity>,
  ) {}

  async search(params: SearchEquipInfoDto) {
    let query = this.repository
      .createQueryBuilder('equip')
      .orderBy('equip.equipmentId', 'ASC');

    query = this.addDateFilters(query, params);
    query = this.addOtherFilters(query, params);

    const result = await query.getMany();

    if (!result || result.length === 0) {
      throw new NotFoundException('Not found');
    }

    const finalResult = this.groupAndCalculateAverage(result);

    return {
      statusCode: 200,
      message: 'Success in fetch data',
      data: finalResult,
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

  private addDateFilters(query: any, params: SearchEquipInfoDto) {
    if (params.initialDate && params.finalDate) {
      const startDate = new Date(params.initialDate);
      const endDate = new Date(params.finalDate);
      endDate.setDate(endDate.getDate() + 1);

      query = query.andWhere('equip.timestamp BETWEEN :start AND :end', {
        start: startDate,
        end: endDate,
      });
    }
    return query;
  }

  private addOtherFilters(query: any, params: SearchEquipInfoDto) {
    if (params.id) {
      query = query.andWhere('equip.id = :id', { id: params.id });
    }

    if (params.equipmentId) {
      query = query.andWhere('equip.equipmentId = :equipmentId', {
        equipmentId: params.equipmentId,
      });
    }

    return query;
  }

  private groupAndCalculateAverage(result: EquipEntity[]) {
    const groupedResult = result.reduce((acc, curr) => {
      if (!acc[curr.equipmentId]) {
        acc[curr.equipmentId] = { ...curr, value: 0, count: 0 };
      }
      acc[curr.equipmentId].value += curr.value;
      acc[curr.equipmentId].count += 1;
      return acc;
    }, {});

    return Object.keys(groupedResult).map((key) => {
      const item = groupedResult[key];
      return {
        equipmentId: item.equipmentId,
        id: item.id,
        value: (item.value / item.count).toPrecision(4), // Calculating average
      };
    });
  }
}
