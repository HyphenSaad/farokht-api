import React, { useState, useEffect, useMemo, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Add, Delete, Edit, Visibility } from '@mui/icons-material'
import { BeatLoader } from 'react-spinners'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthContext, CustomDataTable } from '../../../components'
import { DeleteItem, FetchItems } from './ItemsAxios'
import { APP_TITLE } from '../../../config'
import { ToastValues } from '../../../values'

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
      toast.success(state.message, ToastValues)

      navigate('/Items', {
        state: {},
        replace: true,
      })
    }

    (async () => {
      if (error.length > 1) return

      await FetchItems({
        pageSize: pagination.pageSize,
        pageIndex: pagination.pageIndex + 1,
        token: authContext.token,
        setError,
        setData,
        navigate
      })

      setIsLoading(false)
    })()
  }, [error, state, navigate, authContext, pagination])

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Title', size: 0 },
    { accessorKey: 'vendorId.contactName', header: 'Vendor', size: 0, },
    { accessorKey: 'status', header: 'Status', size: 0 },
    { accessorKey: 'updatedAt', header: 'Last Modified', size: 0 },
    { accessorKey: 'createdAt', header: 'Created At', size: 0 },
  ], [])

  const IconStyles = {
    marginRight: '0.25rem',
    fontSize: '1rem',
  }

  return (
    <Container style={{
      padding: '1.25rem',
    }} >
      <ToastContainer />
      <Container style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
      }} >
        {
          isLoading
            ?
            <div className='d-flex justify-content-center align-items-center flex-column py-3'>
              <span className='mb-2 fs-5 text-secondary'>
                {
                  error.length > 0
                    ? <>{error}<br />{'Refresh The Page!'}</>
                    : 'Loading Data'
                }
              </span>
              {
                error.length > 0
                  ? ''
                  : <BeatLoader color='#333333' size={12} />
              }
            </div>
            :
            <CustomDataTable
              rowCount={data.totalItems}
              onPaginationChange={setPagination}
              state={{
                isLoading,
                pagination,
              }}
              columns={columns}
              data={data.items}
              renderTopToolbarCustomActions={() => (
                <Button
                  variant='primary'
                  onClick={() => navigate('/ItemInfo')}
                  className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'>
                  <Add style={IconStyles} />Add
                </Button>
              )}
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: 'flex' }}>
                  <Tooltip
                    arrow
                    placement='left'
                    title='Edit'>
                    <IconButton onClick={() => navigate(`/ItemInfo/${row.original._id}`)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    arrow
                    placement='right'
                    title='View'>
                    <IconButton
                      color='primary'
                      onClick={() => {
                        navigate(`/ItemInfo/${row.original._id}`, {
                          state: {
                            mode: 0,
                          },
                        })
                      }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    arrow
                    placement='right'
                    title='Delete'>
                    <IconButton
                      color='error'
                      onClick={async () => {
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
            />
        }
      </Container>
    </Container>
  )
}

export default Items