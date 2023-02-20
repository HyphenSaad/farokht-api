import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import axios from 'axios'
import MaterialReactTable from 'material-react-table'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Add, Edit } from '@mui/icons-material'
import { BeatLoader } from 'react-spinners'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { API_BASE_URL } from '../../config.js'

const Attributes = () => {
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

      navigate('/Attributes', { state: {}, replace: true })
    }

    (async () => {
      if (error.length > 1) return

      const result = await axios.get(`${API_BASE_URL}attribute/`, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userData')).token}`
        },
      }).catch(error => {
        console.log(error)
        setError(error.response.statusText)
      })

      setError('')
      setData(result.data)
      setIsLoading(false)
    })()
  }, [error, state, navigate])

  const columns = useMemo(
    () => [
      { accessorKey: 'name', header: 'Attribute Name' },
      { accessorKey: 'createdBy', header: 'Created By' },
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
                onClick={() => navigate('/AttributeInfo')}
                className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'>
                <Add style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Add
              </Button>
            )}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex' }}>
                <Tooltip arrow placement='left' title='Edit'>
                  <IconButton onClick={() => navigate('/AttributeInfo/' + row.original._id)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />}
      </Container>
    </Container>
  )
}

export default Attributes
