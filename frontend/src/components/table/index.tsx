import React, { ChangeEvent, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { SearchEquipInfoDto } from '../../api/dto/searchEquipInfo.dto';

interface Column {
  id: 'equipmentId' | 'value';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'equipmentId', label: 'equipmentId', minWidth: 170 },
  { id: 'value', label: 'average value', minWidth: 100 },
];


interface EquipTableProps {
  equipments: SearchEquipInfoDto[];
}

const EquipTable = ({ equipments }: EquipTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if(equipments?.length > 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
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
              {equipments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((equipment) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={equipment.id}>
                      {columns.map((column) => {
                        const value = equipment[column.id as keyof SearchEquipInfoDto];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={equipments.length}
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

export default EquipTable;
