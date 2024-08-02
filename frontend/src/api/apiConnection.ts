import axios from 'axios';
import { SaveEquipInfoDto } from './dto/saveEquipInfoDto.dto';
import { SearchEquipInfoDto } from './dto/searchEquipInfo.dto';
import { SearchEquipInfoByDateDto } from './dto/searchEquipInfoByDate.dto';

const BASE_URL = 'http://localhost:3000/equip';

export const searchEquip = async (params?: SearchEquipInfoDto) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, { params });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const searchAllEquipByDate = async (params: SearchEquipInfoByDateDto) => {
  if (!params || (!params.initialDate && !params.finalDate)) {
    throw new Error('Please provide search parameter: initialDate or finalDate');
  }

  try {
    const response = await axios.get(`${BASE_URL}/search-all`, { params });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const saveEquip = async (equip: SaveEquipInfoDto) => {
  try {
    const response = await axios.post(`${BASE_URL}/save`, equip);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const uploadEquipCsv = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};
