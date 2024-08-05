import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import EquipTable from '../../components/table';
import Button from '@mui/material/Button';
import './style.css';
import { searchEquip, uploadEquipCsv} from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Graphics } from '../../components/graphics';
import { SearchEquipInfoDto } from '../../api/dto/searchEquipInfo.dto';
import InputFileUpload from '../../components/buttonUploadFile';

const EquipmentsList = () => {
    const [equipments, setEquipments] = useState<Array<SearchEquipInfoDto>>([]);
    const [timeSelected, setTimeSelected] = useState('');

    const subtractDays = (date: Date, days: number) => {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result.toISOString();
    };

    const date = new Date();
    const options = [{ label: '24 Hours', initialDate: subtractDays(date, 1)}, 
        { label: '48 Hours', initialDate: subtractDays(date, 2)}, 
        { label: 'One week', initialDate: subtractDays(date, 7)}, 
        { label: 'One Month', initialDate: subtractDays(date, 30)}
    ]


    const handleChange = (event: SelectChangeEvent) => {
        setTimeSelected(event.target.value as string);
    };

    const loadEquipments = async (param?: string) => {
        try {
            if(param) {
                const option = options.find((item) => item.label === param)
                const { data } = await searchEquip({initialDate: option?.initialDate, finalDate: date.toISOString()});
                setEquipments(data);
            } else {
                const { data } = await searchEquip();
                setEquipments(data);
            }
        } catch (error) {
            toast.error('Error on search data');
        }
    };

    const handleFileUpload = async (event: any) => {
        const file = event.target.files[0];
        try {
            await uploadEquipCsv(file)
            toast.success('Success saving file')
        } catch (error) {
            toast.error('Error while saving file');
        }
      };

      useEffect(() => {
        loadEquipments()
      }, [])

    return (
        <div>
            <Header>
                <ToastContainer />
                <Box sx={{ minWidth: 200 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Select time</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={timeSelected}
                            label="Time"
                            onChange={handleChange}
                        >
                            <MenuItem value="None">
                                None
                            </MenuItem>
                        {options.map((item) => (
                            <MenuItem key={item.label} value={item.label}>
                            {item.label}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Box>
                <div className="button-load" >
                    <Button variant="contained" onClick={() => loadEquipments(timeSelected)}>Search</Button>
                </div>

               <InputFileUpload handleFileUpload={handleFileUpload} />
            </Header>
            {equipments?.length > 0 ? (
                <div className="infos-area">
                    <div className="table-info-area">
                        <EquipTable equipments={equipments} />
                    </div>
                    <div className="graphic-info-area">
                        <Graphics equipments={equipments} />
                    </div>
                </div>
            ): <div>No results for this date</div>}
        </div>
    )
}

export default EquipmentsList;