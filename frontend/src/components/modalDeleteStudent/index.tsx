import React, { Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import TextInput from '../textInput';
import './style.css';
import { deleteStudent } from '../../api';
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

export default function DeleteStudantModal({open, setOpen, setReload, student }: BasicModalProps) {

  const { nome, email, cpf, id } = student
  const sendDeleteStudent = async () => {
    try {
        const data = await deleteStudent(id);
        if(data.statusCode === 200) {
          toast.success('Cadastro deletado com sucesso');
          setOpen(false)
          setReload(true);
          return
        }
        if(data?.response?.request?.status !== 200 || data.statusCode !== 200){
          toast.error('Erro ao deletar cadastro!');
        }
    } catch (error) {
      toast.error('Erro ao deletar cadastro!');
    }
  };

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
            Deletar cadastro de aluno
          </div>
          <div className="modal-inputs-area">
            <div className="modal-input-area">
              <TextInput 
                value={nome}
                label="Nome"
                required={true}
              />
            </div>
            <div className="modal-input-area">
              <TextInput 
                value={cpf}
                label="Cpf"
                required={true}
              />
            </div>
            <div className="modal-input-area">
              <TextInput 
                value={email}
                label="Email"
                required={true}
              />
            </div>
            <Button variant="contained" onClick={() => sendDeleteStudent()}>Deletar</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}