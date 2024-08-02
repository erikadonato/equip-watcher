import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { IconButton } from '@mui/material';
import DeleteStudantModal from '../modalDeleteStudent';
import EditStudantModal from '../modalEditStudent';

interface Column {
  id: 'nome' | 'email' | 'cpf';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 100 },
  { id: 'cpf', label: 'Cpf', minWidth: 100 },
];

interface StudentProps {
  nome: string;
  email: string;
  cpf: string;
  id: string; 
}

interface StudentsTableProps {
  students: StudentProps[];
  setReload: Dispatch<SetStateAction<boolean>>;
}

const StudentsTable = ({ students, setReload }: StudentsTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = useState({nome: '', email: '' , cpf:'', id: ''});

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteStudent = (student: StudentProps) => {
    setSelectedStudent(student)
    setOpenDelete(true)
  }

  const handleEditStudent = (student: StudentProps) => {
    setSelectedStudent(student)
    setOpenEdit(true)
  }

  if(students?.length > 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <DeleteStudantModal open={openDelete} setOpen={setOpenDelete} setReload={setReload} student={selectedStudent} />
        <EditStudantModal open={openEdit} setOpen={setOpenEdit} setReload={setReload} student={selectedStudent} />
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id +1}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((student) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={student.id}>
                      {columns.map((column) => {
                        const value = student[column.id as keyof StudentProps];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                      <TableCell>
                        <Tooltip title="Deletar">
                          <IconButton onClick={() => handleDeleteStudent(student)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleEditStudent(student)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={students.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  } else {
    return (
      <></>
    )
  }

};

export default StudentsTable;
