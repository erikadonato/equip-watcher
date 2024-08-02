import React, { ChangeEvent, useEffect, useState } from 'react';
import TextInput from '../../components/textInput';
import Header from '../../components/header';
import StudentsTable from '../../components/table';
import Button from '@mui/material/Button';
import './style.css';
import AddStudantModal from '../../components/modalAddStudent';
import { searchStudent } from '../../api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentsList = () => {
    const [name, setName] = useState(""); 
    const [email, setEmail] = useState(""); 
    const [cpf, setCpf] = useState(""); 
    const [openAdd, setOpenAdd] = React.useState(false);
    const [students, setStudents] = useState([]);
    const [reload, setReload ] = useState(false); 

    const loadStudents = async () => {
        try {
            if(name || email || cpf) {
                const {data, statusCode} = await searchStudent({name, email, cpf});
                if(statusCode === 200) {
                    setStudents(data);
                    return
                }
                if(statusCode !== 200 || !statusCode){
                    toast.warn('Aluno não encontrado!');
                }
            } else {
                const { data } = await searchStudent({});
                setStudents(data);
            }

        } catch (error) {
            toast.error('Erro ao listar alunos!');
        }
    };

      useEffect(() => {
        loadStudents()
        setReload(false);
      }, [reload])

    return (
        <div>
            <Header>
            <ToastContainer />
                <TextInput 
                    value={name}
                    label="Nome"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                />
                <TextInput 
                    value={cpf}
                    label="Cpf"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)} 
                />
                <TextInput 
                    value={email}
                    label="Email"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} 
                />
                <Button variant="contained" onClick={() => loadStudents()}>Pesquisar</Button>
            </Header>
            <StudentsTable 
                students={students} 
                setReload={setReload}
            />
            <div className="button-add-student">
                <Button variant="contained" onClick={() => setOpenAdd(true)}>Adicionar novo aluno</Button>
                <AddStudantModal open={openAdd} setOpen={setOpenAdd} setReload={setReload} />
            </div>
        </div>
    )
}

export default StudentsList;