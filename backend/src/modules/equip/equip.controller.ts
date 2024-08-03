import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SearchEquipInfoDto } from './dto/searchEquipInfo.dto';
import { EquipService } from './equip.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../shared/multer.config';
import { SaveEquipInfoDto } from './dto/saveEquipInfo.dto';

@Controller('equip')
export class EquipController {
  constructor(private readonly equipService: EquipService) {}

  @Post('save')
  saveEquipData(@Body() saveEquipInfoDto: SaveEquipInfoDto) {
    return this.equipService.save(saveEquipInfoDto);
  }

  @Get('search')
  findEquipData(@Query() query: SearchEquipInfoDto) {
    return this.equipService.search(query);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new BadRequestException('Please upload a valid CSV file');
    }
    await this.equipService.updateFromCsv(file.path);
  }
}
