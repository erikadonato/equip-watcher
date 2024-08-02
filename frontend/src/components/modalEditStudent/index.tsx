import React, { useState, Dispatch, SetStateAction, ChangeEvent, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextInput from '../textInput';
import './style.css';
import { updateStudent } from '../../api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

interface BasicModalProps {
  open: boolean; 
  setOpen: Dispatch<SetStateAction<boolean>>;
  setReload: Dispatch<SetStateAction<boolean>>;
  student: {
    nome: string; 
    email: string; 
    cpf: string; 
    id: string;
  }
}

export default function EditStudantModal({open, setOpen, setReload, student}: BasicModalProps) {
  const { id } = student;
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState(""); 
  const [cpf, setCpf] = useState(""); 

  const sendEditStudent = async () => {
    if(name === "" || email === "" || cpf === "") {
      toast.warn('Preencha todos os campos');
      return
    }
    try {
        const data = await updateStudent({nome: name, email, cpf, id});
        if(data.statusCode === 200) {
          toast.success('Cadastro atualizado com sucesso');
          setOpen(false)
          setReload(true);
          return
        }
        if(data?.response?.request?.status !== 200 || data.statusCode !== 200){
          toast.error('Erro ao atualizar aluno!');
        }
    } catch (error) {
      toast.error('Erro ao cadastrar aluno!');
    }
  };

  useEffect(() => {
    setName(student.nome)
    setEmail(student.email)
    setCpf(student.cpf)
  }, [student])

  return (
    <div>
      <Modal
        open={open}
        onClose={setOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal-close-button">
            <Tooltip title="Fechar">
              <IconButton onClick={() => setOpen(false)} >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div className="modal-title">
            Alterar cadastro de aluno
          </div>
          <div className="modal-inputs-area">
            <div className="modal-input-area">
              <TextInput 
                value={name}
                label="Nome"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} 
              />
            </div>
            <div className="modal-input-area">
              <TextInput 
                value={cpf}
                label="Cpf"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCpf(e.target.value)} 
              />
            </div>
            <div className="modal-input-area">
              <TextInput 
                value={email}
                label="Email"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <Button variant="contained" onClick={() => sendEditStudent()}>Salvar</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}