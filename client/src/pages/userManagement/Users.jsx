import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import axios from 'axios'
import MaterialReactTable from 'material-react-table'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { BeatLoader } from 'react-spinners'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_BASE_URL } from '../../config.js'

const Users = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { state } = useLocation()

  useEffect(() => {
    if (state?.message && !toast.isActive('xyz')) {
      toast.success(state.message, {
        position: 'top-right',
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: 'light',
        toastId: 'xyz',
      })

      navigate('/Users', { state: {}, replace: true })
    }

    (async () => {
      if (error.length > 1) return

      const result = await axios.get(`${API_BASE_URL}user/`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`
        },
      }).catch(error => {
        setError(error.response.statusText)
      })

      const data = result.data.users

      if (data.length > 0) {
        data.forEach(user => {
          user.fullName = `${user.firstName} ${user.lastName}`
          user.phoneNumber1 = `+92${user.phoneNumber1}`
          user.phoneNumber2 = `+92${user.phoneNumber2}`
          user.status = user.status.charAt(0).toUpperCase() + user.status.slice(1)
          user.role = user.role.charAt(0).toUpperCase() + user.role.slice(1)
        })
        setData(result.data.users)
      }

      setError('')
      setIsLoading(false)
    })()
  }, [error, state, navigate])

  const columns = useMemo(
    () => [
      { accessorKey: 'fullName', header: 'Fullname' },
      { accessorKey: 'phoneNumber1', header: 'Phone #', size: 100 },
      { accessorKey: 'role', header: 'Role', size: 60 },
      { accessorKey: 'status', header: 'Status', size: 60 },
    ],
    [],
  );

  return (
    <Container style={{ padding: '1.25rem' }} >
      <ToastContainer />
      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} >
        {isLoading
          ?
          <div className='d-flex justify-content-center align-items-center flex-column py-3'>
            <span className='mb-2 fs-5 text-secondary'>
              {error.length > 0 ? error : 'Loading Data'}
            </span>
            {error.length > 0 ? '' : <BeatLoader color='#333333' size={12} />}
          </div>
          :
          <MaterialReactTable
            columns={columns}
            data={data}
            initialState={{ density: 'compact' }}
            enableColumnFilters={true}
            enablePagination={true}
            enableSorting={true}
            enableBottomToolbar={true}
            enableTopToolbar={true}
            muiTableBodyRowProps={{ hover: false }}
            enableEditing={true}
            positionActionsColumn='last'
            renderTopToolbarCustomActions={() => (
              <Button variant='primary'
                onClick={() => navigate('/UserInfo')}
                className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'>
                <Add style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Add
              </Button>
            )}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex' }}>
                <Tooltip arrow placement='left' title='Edit'>
                  <IconButton onClick={() => navigate('/UserInfo/' + row.original._id)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement='right' title='Suspend'>
                  <IconButton color='error' onClick={async () => {
                    await axios.delete(`${API_BASE_URL}user/${row.original._id}`, {
                      headers: {
                        'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`
                      },
                    }).then((response) => {
                      if (response.status === 200) {
                        navigate('/Users', { state: { message: 'User Suspended Successfully!' }, replace: true })
                      }
                    }).catch(error => {
                      console.log(error)
                      setError(error.response.data.message)
                    })
                  }}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />}
      </Container>
    </Container>
  )
}

export default Users
