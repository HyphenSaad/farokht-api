import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Table, Button, } from 'react-bootstrap'
import { Add } from '@mui/icons-material'
import axios from 'axios'
import { useTable } from "react-table"

const Users = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([])

  useEffect(() => {
    (async () => {
      const result = await axios.get('http://localhost:5000/api/v1/user/',
        {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`
          },
        })
      setData(result.data.users)
    })();
  }, [])

  const columns = useMemo(() => [
    {
      Header: ' ',
      columns: [
        {
          Header: "First Name",
          accessor: "firstName",
        },
        {
          Header: "Last Name",
          accessor: "lastName",
        },
      ],
    },
  ], [])

  const { getTableProps, getTableBodyProps, allColumns, rows, prepareRow } = useTable({ columns, data })

  return (
    <Container style={{ padding: '1.25rem' }} >
      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} >
        <Button variant='primary' className='text-uppercase d-flex justify-content-center align-items-center'
          onClick={() => navigate('/AddUser')}>
          <Add style={{ marginRight: '0.25rem', fontSize: '1.25rem' }} />Add User
        </Button>

        <Table {...getTableProps()}>
          <thead>
            <tr>
              {allColumns.map(column => <th {...column.getHeaderProps()}>{column.render("Header")}</th>)}
            </tr>
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => <td {...cell.getCellProps()}>{cell.render("Cell")}</td>)}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>
    </Container>
  )
}

export default Users
