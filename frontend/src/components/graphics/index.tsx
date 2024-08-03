import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SearchEquipInfoDto } from '../../api/dto/searchEquipInfo.dto';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EquipmentsProps {
    equipments: SearchEquipInfoDto[], 
}


const options = {
    plugins: {
        legend: {
            display: false,
        }
    },
    responsive: true,
    scales: {
    x: {
        stacked: true,
    },
    y: {
        stacked: true,
    },
    },
};

function getRandomRGBColor() {
    const getRandomValue = () => Math.floor(Math.random() * 256);
  
    const r = getRandomValue();
    const g = getRandomValue();
    const b = getRandomValue();
  
    return `rgb(${r}, ${g}, ${b})`;
}


export function Graphics({equipments}: EquipmentsProps) {
    const labels = equipments.map((item) => item.equipmentId) 
    const data = {
        labels,
        datasets: [{
            data: equipments.map((item) => item.value),
            backgroundColor: equipments.map(() => getRandomRGBColor()) 
        }]
    }; 

    return <Bar options={options} data={data} />;
}
