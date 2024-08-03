import React, { ChangeEvent, useEffect, useState } from 'react';
import TextInput from '../../components/textInput';
import Header from '../../components/header';
import EquipTable from '../../components/table';
import Button from '@mui/material/Button';
import './style.css';
import AddEquipmentDataModal from '../../components/modalAddData';
import { searchEquip} from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Graphics } from '../../components/graphics';

const EquipmentsList = () => {
    const [openAdd, setOpenAdd] = React.useState(false);
    const [equipments, setEquipments] = useState([]);
    const [timeSelected, setTimeSelected] = React.useState('');

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
                console.log('estou aqui', data)
                setEquipments(data);
            } else {
                const { data } = await searchEquip();
                console.log('estou aqui2', data)
                setEquipments(data);
            }
        } catch (error) {
            toast.error('Error on search data');
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
                <div className="button-add-equipment">
                    <Button variant="contained" onClick={() => setOpenAdd(true)}>Upload CSV</Button>
                    <AddEquipmentDataModal open={openAdd} setOpen={setOpenAdd} />
                </div>
            </Header>
            <EquipTable equipments={equipments} />
            <Graphics />
        </div>
    )
}

export default EquipmentsList;