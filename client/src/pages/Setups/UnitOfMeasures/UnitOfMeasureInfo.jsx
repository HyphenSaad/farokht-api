import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'

import { AuthContext, GoBackButton, TextField } from '../../../components'
import UnitOfMeasureInfoSchema from './UnitOfMeasureInfoYupSchema'
import { FetchUnitOfMeasureData, SubmitUnitOfMeasureData } from './UnitOfMeasureInfoAxios'

const UnitOfMeasureInfo = () => {
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
    createdBy: `${currentUser.firstName} ${currentUser.lastName}`
  })

  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return () => { }
    }

    if (parameters.id === undefined) return
    setIsEditMode(true)

    FetchUnitOfMeasureData({
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
    validationSchema: UnitOfMeasureInfoSchema,
    onSubmit: async (values) => {
      SubmitUnitOfMeasureData({
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
            {fetchError.length > 0 ? '' : <BeatLoader color="#333333" size={12} />}
          </div>
          :
          <>
            <p className='fs-3 fw-bold text-uppercase d-inline'>
              {isEditMode ? 'Edit Unit Of Measure' : 'Add Unit Of Measure'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik enableReinitialize>
              <Form onSubmit={formik.handleSubmit} className='mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='name' formik={formik}
                      label='Unit of Measure' placeholder='Enter Unit of Measure' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='createdBy' formik={formik} disable={true}
                      label='Created By' placeholder='Enter Created By' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}
                    className='d-flex justify-content-end align-items-end mt-1 pb-3'>
                    <Button variant='danger' type='reset' className='w-100 me-3 text-uppercase' onClick={e => {
                      setInitialValues({ name: '', createdBy: `${currentUser.firstName} ${currentUser.lastName}` })
                      formik.resetForm(formik.initialValues)
                      setError('')
                    }}>Clear</Button>
                    <Button variant='success' type='submit' className='w-100 text-uppercase'>
                      {isLoading
                        ? <BeatLoader color="#fff" size={8} />
                        : isEditMode ? 'Update' : 'Proceed'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Formik>
          </>
        }
      </Container>
      <GoBackButton path='/UnitOfMeasures' />
    </Container>
  )
}

export default UnitOfMeasureInfo