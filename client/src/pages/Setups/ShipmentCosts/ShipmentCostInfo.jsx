import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Save, Clear, Done } from '@mui/icons-material'

import { AuthContext, GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import ShipmentCostInfoSchema from './ShipmentCostInfoYupSchema'
import { StatusOptions } from './ShipmentCostInfoValues'
import { FetchShipmentCostData, SubmitShipmentCostData } from './ShipmentCostInfoAxios'
import { APP_TITLE } from '../../../config'

const ShipmentCostInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [showClearDialogue, setShowClearDialogue] = useState(false)

  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const authContext = useContext(AuthContext)
  const currentUser = authContext.user

  const [initialValues, setInitialValues] = useState({
    source: '',
    destination: '',
    days: '',
    minCost: '',
    maxCost: '',
    status: { value: '', label: 'Choose Status' },
    updatedBy: `${currentUser.firstName} ${currentUser.lastName}`,
    createdBy: `${currentUser.firstName} ${currentUser.lastName}`,
  })

  const mounted = useRef(false)
  useEffect(() => {
    document.title = `Shipment Cost Info | ${APP_TITLE}`

    if (!mounted.current) {
      mounted.current = true
      return () => { }
    }

    if (parameters.id === undefined) return
    if (state && state.mode === 0) setIsViewMode(true)
    setIsEditMode(true)

    FetchShipmentCostData({
      token: authContext.token,
      id: parameters.id,
      setFetchError,
      setInitialValues,
      setIsGettingData,
      navigate
    })
  }, [parameters, setInitialValues, authContext, state, navigate])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: ShipmentCostInfoSchema,
    onSubmit: async (values) => {
      SubmitShipmentCostData({
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
              {isEditMode ? (isViewMode ? 'View Shipment Cost' : 'Edit Shipment Cost') : 'Add Shipment Cost'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik enableReinitialize>
              <Form onSubmit={formik.handleSubmit} className='mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='source' formik={formik} disable={isViewMode}
                      label='Source' placeholder='Enter Source' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='destination' formik={formik} disable={isViewMode}
                      label='Destination' placeholder='Enter Destination' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='days' formik={formik} disable={isViewMode}
                      label='Shipment Days' placeholder='Enter Days' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='minCost' formik={formik} disable={isViewMode}
                      label='Minimum Cost' placeholder='Enter Minimum Cost' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='maxCost' formik={formik} disable={isViewMode}
                      label='Maxmium Cost' placeholder='Enter Maximum Cost' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Status</Form.Label>
                      <Select
                        isDisabled={isViewMode}
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
                    <TextField name='updatedBy' formik={formik} disable={true}
                      label='Updated By' placeholder='Enter Updated By' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='createdBy' formik={formik} disable={true}
                      label='Created By' placeholder='Enter Created By' />
                  </Col>
                  {isEditMode ? '' :
                    <Col sm={12} md={12} lg={6} xl={3}
                      className='d-flex justify-content-end align-items-end mt-1 gap-3 pb-3'>
                      <Button type='reset' className='text-uppercase d-flex justify-content-center align-items-center pe-3'
                        style={{ width: '50%' }}
                        variant='danger'
                        onClick={e => setShowClearDialogue(true)}>
                        <Clear style={{ marginRight: '0.25rem', fontSize: '1.25rem' }} />{'Clear'}
                      </Button>
                      <Button type='submit' className='text-uppercase d-flex justify-content-center align-items-center pe-3'
                        style={isLoading ? { width: '50%', height: '2.35rem' } : { width: '50%' }}
                        variant='success'>
                        {isLoading
                          ? <BeatLoader color='#fff' size={8} />
                          : isEditMode
                            ? <><Save style={{ marginRight: '0.25rem', fontSize: '1.25rem' }} />{'Update'}</>
                            : <><Done style={{ marginRight: '0.25rem', fontSize: '1.25rem' }} />{'Proceed'}</>
                        }
                      </Button>
                    </Col>}
                </Row>
                {showClearDialogue ?
                  <CustomAlertDialogue
                    title='Warning'
                    positiveMessage='Proceed'
                    negativeMessage='Cancel'
                    positiveCallback={() => {
                      setInitialValues({
                        source: '',
                        destination: '',
                        days: '',
                        minCost: '',
                        maxCost: '',
                        status: { value: '', label: 'Choose Status' },
                        updatedBy: `${initialValues.updatedBy.firstName} ${initialValues.updatedBy.lastName}`,
                        createdBy: `${initialValues.createdBy.firstName} ${initialValues.createdBy.lastName}`,
                      })
                      formik.resetForm(formik.initialValues)
                      setError('')
                      setShowClearDialogue(false)
                    }}
                    negativeCallback={() => setShowClearDialogue(false)}
                    show={showClearDialogue}
                    handleClose={() => setShowClearDialogue(false)}>
                    <p>Are you sure you want to clear this form?</p>
                    <p>All data will be lost if you proceed.</p>
                  </CustomAlertDialogue>
                  : ''}
              </Form>
            </Formik>
          </>
        }
      </Container>
      <GoBackButton path='/ShipmentCosts' />
    </Container>
  )
}

export default ShipmentCostInfo