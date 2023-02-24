import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'
import Select from 'react-select'

import { AuthContext, GoBackButton, TextField } from '../../../components'
import TagInfoSchema from './TagInfoYupSchema'
import { StatusOptions } from './TagInfoValues'
import { FetchTagData, SubmitTagData } from './TagInfoAxios'
import { APP_TITLE } from '../../../config'

const TagInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()

  const authContext = useContext(AuthContext)
  const currentUser = authContext.user

  const [initialValues, setInitialValues] = useState({
    name: '',
    status: { value: '', label: 'Choose Status' },
    createdBy: `${currentUser.firstName} ${currentUser.lastName}`,
  })

  const mounted = useRef(false)
  useEffect(() => {
    document.title = `Tag Info | ${APP_TITLE}`

    if (!mounted.current) {
      mounted.current = true
      return () => { }
    }

    if (parameters.id === undefined) return
    setIsEditMode(true)

    FetchTagData({
      token: authContext.token,
      id: parameters.id,
      setFetchError,
      setInitialValues,
      setIsGettingData
    })
  }, [parameters, setInitialValues, authContext])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: TagInfoSchema,
    onSubmit: async (values) => {
      SubmitTagData({
        token: authContext.token,
        id: parameters.id,
        values, isEditMode, navigate,
        setError, setIsLoading
      })
    },
  })

  return (
    <Container style={{ padding: '1.25rem' }} >
      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} >
        {isGettingData && isEditMode
          ?
          <div className='d-flex justify-content-center align-items-center flex-column py-3'>
            <span className='mb-2 fs-5 text-secondary'>
              {fetchError.length > 0 ? fetchError : 'Getting Data'}
            </span>
            {fetchError.length > 0 ? '' : <BeatLoader color='#333333' size={12} />}
          </div>
          :
          <>
            <p className='fs-3 fw-bold text-uppercase d-inline'>
              {isEditMode ? 'Edit Tag' : 'Add Tag'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik enableReinitialize>
              <Form onSubmit={formik.handleSubmit} className='mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='name' formik={formik}
                      label='Tag Title' placeholder='Enter Tag Title' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Status</Form.Label>
                      <Select
                        key='status'
                        name='status'
                        instanceId='status'
                        placeholder='Choose Status'
                        isSearchable={false}
                        onChange={(data) => formik.setFieldValue('status', data)}
                        options={StatusOptions}
                        value={formik.values.status}
                      />
                      {formik.errors.status && formik.touched.status
                        ? <Form.Text className='text-danger'>{formik.errors.status.value}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='createdBy' formik={formik} disable={true}
                      label='Created By' placeholder='Enter Created By' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}
                    className='d-flex justify-content-end align-items-end mt-1 pb-3'>
                    <Button variant='danger' type='reset' className='w-100 me-3 text-uppercase' onClick={e => {
                      setInitialValues({
                        name: '',
                        status: { value: '', label: 'Choose Status' },
                        createdBy: `${currentUser.firstName} ${currentUser.lastName}`
                      })
                      formik.resetForm(formik.initialValues)
                      setError('')
                    }}>Clear</Button>
                    <Button variant='success' type='submit' className='w-100 text-uppercase'>
                      {isLoading
                        ? <BeatLoader color='#fff' size={8} />
                        : isEditMode ? 'Update' : 'Proceed'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Formik>
          </>
        }
      </Container>
      <GoBackButton path='/Tags' />
    </Container>
  )
}

export default TagInfo