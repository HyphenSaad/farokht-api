import React, { useState, useEffect, useMemo, useContext, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Add, Delete, Edit, Visibility } from '@mui/icons-material'
import { BeatLoader } from 'react-spinners'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthContext, CustomDataTable } from '../../../components'
import { DeleteUser, FetchUsers } from './UsersAxios'
import { APP_TITLE } from '../../../config'
import { ToastValues } from '../../../values'

const Users = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10, })
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { state } = useLocation()

  const authContext = useContext(AuthContext)

  const mounted = useRef(false)
  useEffect(() => {
    document.title = `Users Info | ${APP_TITLE}`

    if (!mounted.current) {
      mounted.current = true
      return () => { }
    }

    if (state?.message && !toast.isActive('xyz')) {
      toast.success(state.message, ToastValues)

      navigate('/Users', {
        state: {},
        replace: true,
      })
    }

    (async () => {
      if (error.length > 1) return

      await FetchUsers({
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
    { accessorKey: 'contactName', header: 'Contact Name', size: 0 },
    { accessorKey: 'companyName', header: 'Company', size: 0 },
    { accessorKey: 'role', header: 'Role', size: 0 },
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
      }}>
        {
          isLoading || error.length > 0
            ?
            <div className='d-flex justify-content-center align-items-center flex-column py-3'>
              <span className='mb-2 fs-5 text-secondary text-center'>
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
              rowCount={data.totalUsers}
              onPaginationChange={setPagination}
              state={{
                isLoading,
                pagination,
              }}
              columns={columns}
              data={data.users}
              renderTopToolbarCustomActions={() => (
                <Button
                  variant='primary'
                  onClick={() => navigate('/UserInfo')}
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
                    <IconButton onClick={() => navigate(`/UserInfo/${row.original._id}`)}>
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
                        navigate(`/UserInfo/${row.original._id}`, {
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
                    title='Suspend'>
                    <IconButton
                      color='error'
                      onClick={async () => {
                        await DeleteUser({
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

export default Users