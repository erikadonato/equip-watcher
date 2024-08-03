import { Test, TestingModule } from '@nestjs/testing';
import { EquipController } from './equip.controller';
import { EquipService } from './equip.service';
import { SaveEquipInfoDto } from './dto/saveEquipInfo.dto';
import { SearchEquipInfoDto } from './dto/searchEquipInfo.dto';
import { BadRequestException } from '@nestjs/common';

const mockEquipEntity = {
  id: '1',
  equipmentId: 'EQ-12495',
  timestamp: new Date('2023-02-15T01:30:00.000-05:00'),
  value: 78.42,
};

const mockEquipService = () => ({
  save: jest.fn().mockResolvedValue(mockEquipEntity),
  search: jest.fn().mockResolvedValue({
    statusCode: 200,
    message: 'Success in the search for',
    data: [mockEquipEntity],
  }),
  searchAllByDate: jest.fn().mockResolvedValue({
    statusCode: 200,
    message: 'Success in the search for',
    data: [mockEquipEntity],
  }),
  updateFromCsv: jest.fn().mockResolvedValue(undefined),
});

describe('EquipController', () => {
  let controller: EquipController;
  let service: ReturnType<typeof mockEquipService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipController],
      providers: [{ provide: EquipService, useFactory: mockEquipService }],
    }).compile();

    controller = module.get<EquipController>(EquipController);
    service = module.get(EquipService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('saveEquipData', () => {
    it('should save and return the entity', async () => {
      const dto: SaveEquipInfoDto = {
        equipmentId: 'EQ-12495',
        timestamp: new Date('2023-02-15T01:30:00.000-05:00'),
        value: 78.42,
      };

      const result = await controller.saveEquipData(dto);
      expect(result).toEqual(mockEquipEntity);
      expect(service.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findEquipData', () => {
    it('should return results if found', async () => {
      const params: SearchEquipInfoDto = { equipmentId: 'EQ-12495' };

      const result = await controller.findEquipData(params);
      expect(result).toEqual({
        statusCode: 200,
        message: 'Success in the search for',
        data: [mockEquipEntity],
      });
      expect(service.search).toHaveBeenCalledWith(params);
    });
  });

  describe('uploadFile', () => {
    it('should upload and process the file', async () => {
      const file = {
        path: 'test.csv',
      } as Express.Multer.File;

      await controller.uploadFile(file);
      expect(service.updateFromCsv).toHaveBeenCalledWith(file.path);
    });

    it('should throw BadRequestException if no file is provided', async () => {
      await expect(controller.uploadFile(null)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
