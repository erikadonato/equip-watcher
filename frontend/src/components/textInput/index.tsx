import React, {ChangeEvent} from 'react';
import TextField from '@mui/material/TextField';
import './style.css';

interface TextInputProps {
    value: string;
    label: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean
}

const TextInput = ({ value, onChange, label, required }: TextInputProps) => {
    return (
        <div className="inputs-area">
            <TextField label={label} value={value} onChange={onChange} required={required} />
        </div>
    )
}

export default TextInput;