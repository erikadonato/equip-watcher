import { Test, TestingModule } from '@nestjs/testing';
import { EquipService } from './equip.service';
import { EquipEntity } from './entities/equip.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SaveEquipInfoDto } from './dto/saveEquipInfo.dto';
import { SearchEquipInfoDto } from './dto/searchEquipInfo.dto';
import { SearchEquipInfoByDateDto } from './dto/searchEquipInfoByDate.dto';
import * as fs from 'fs';

const mockEquipEntity = {
  id: '1',
  equipmentId: 'EQ-12495',
  timestamp: new Date('2023-02-15T01:30:00.000-05:00'),
  value: 78.42,
};

const mockEquipRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

describe('EquipService', () => {
  let service: EquipService;
  let repository: ReturnType<typeof mockEquipRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipService,
        {
          provide: getRepositoryToken(EquipEntity),
          useFactory: mockEquipRepository,
        },
      ],
    }).compile();

    service = module.get<EquipService>(EquipService);
    repository = module.get(getRepositoryToken(EquipEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('search', () => {
    it('should return results if found', async () => {
      repository.find.mockResolvedValue([mockEquipEntity]);

      const params: SearchEquipInfoDto = { equipmentId: 'EQ-12495' };
      const result = await service.search(params);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Success in fetch data',
        data: [mockEquipEntity],
      });
    });

    it('should throw NotFoundException if no results', async () => {
      repository.find.mockResolvedValue([]);

      const params: SearchEquipInfoDto = { equipmentId: 'EQ-12495' };

      await expect(service.search(params)).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchAllByDate', () => {
    it('should return results if found', async () => {
      repository.find.mockResolvedValue([mockEquipEntity]);

      const params: SearchEquipInfoByDateDto = {
        initialDate: new Date('2023-01-01'),
        finalDate: new Date('2023-12-31'),
      };
      const result = await service.searchAllByDate(params);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Success in the search using date params',
        data: [mockEquipEntity],
      });
    });

    it('should throw NotFoundException if no results', async () => {
      repository.find.mockResolvedValue([]);

      const params: SearchEquipInfoByDateDto = {
        initialDate: new Date('2023-01-01'),
        finalDate: new Date('2023-12-31'),
      };

      await expect(service.searchAllByDate(params)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('save', () => {
    it('should save and return the entity', async () => {
      repository.create.mockReturnValue(mockEquipEntity);
      repository.save.mockResolvedValue(mockEquipEntity);

      const dto: SaveEquipInfoDto = {
        equipmentId: 'EQ-12495',
        timestamp: new Date('2023-02-15T01:30:00.000-05:00'),
        value: 78.42,
      };
      const result = await service.save(dto);

      expect(result).toEqual({
        statusCode: 200,
        message: 'Success saving data',
        data: mockEquipEntity,
      });
    });
  });

  describe('updateFromCsv', () => {
    it('should update existing entity and save new entity', async () => {
      const csvData = `equipmentId,timestamp,value
      EQ-12495,2023-02-15T01:30:00.000-05:00,78.42
      EQ-12496,2023-03-20T14:45:00.000-05:00,88.56`;

      const filePath = 'test.csv';
      fs.writeFileSync(filePath, csvData);

      repository.findOne.mockResolvedValueOnce(mockEquipEntity); // Existing record
      repository.findOne.mockResolvedValueOnce(null); // New record

      const saveSpy = jest.spyOn(repository, 'save');

      await service.updateFromCsv(filePath);

      expect(saveSpy).toHaveBeenCalledTimes(2);
      fs.unlinkSync(filePath);
    });
  });
});
