import React, { useState, useEffect, useMemo, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { BeatLoader } from 'react-spinners'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthContext, CustomDataTable } from '../../../components'
import { DeleteItem, FetchItems } from './ItemsAxios'
import { APP_TITLE } from '../../../config'

const Items = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, })
  const [isLoading, setIsLoading] = useState(true)

  const [data, setData] = useState([])
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { state } = useLocation()

  const authContext = useContext(AuthContext)

  const mounted = useRef(false)
  useEffect(() => {
    document.title = `Items Info | ${APP_TITLE}`

    if (!mounted.current) {
      mounted.current = true
      return () => { }
    }

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

      navigate('/Items', { state: {}, replace: true })
    }

    (async () => {
      if (error.length > 1) return

      await FetchItems({
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex + 1,
        token: authContext.token,
        setError, setData
      })

      setIsLoading(false)
    })()
  }, [error, state, navigate, authContext, pagination])

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Title', size: 150 },
    { accessorKey: 'uom', header: 'UOM', size: 100, },
    { accessorKey: 'minOrderNumber', header: 'Minimum Order #', size: 100, },
    { accessorKey: 'fullName', header: 'Vendor', size: 100, },
    { accessorKey: 'status', header: 'Status', size: 100, },
    { accessorKey: 'createdAt', header: 'Created At', size: 100, },
    { accessorKey: 'updatedAt', header: 'Last Modified', size: 100, },
  ], [],)

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
          <CustomDataTable
            rowCount={data.totalItems}
            onPaginationChange={setPagination}
            state={{ isLoading, pagination }}
            columns={columns}
            data={data.items}
            renderTopToolbarCustomActions={() => (
              <Button variant='primary'
                onClick={() => navigate('/ItemInfo')}
                className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'>
                <Add style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Add
              </Button>
            )}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex' }}>
                <Tooltip arrow placement='left' title='Edit'>
                  <IconButton onClick={() => navigate('/ItemInfo/' + row.original._id)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement='right' title='Suspend'>
                  <IconButton color='error' onClick={async () => {
                    await DeleteItem({
                      id: row.original._id,
                      token: authContext.token,
                      setError,
                      navigate,
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

export default Items