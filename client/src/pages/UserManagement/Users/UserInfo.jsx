import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Save, Clear, Done } from '@mui/icons-material'

import { AuthContext, GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import { APP_TITLE } from '../../../config'
import { UserInfoAddSchema, UserInfoEditSchema } from './UserInfoYupSchema'
import { FetchUserData, SubmitUserData } from './UserInfoAxios'
import { InitialValues, RoleOptions, StatusOptions } from './UserInfoValues'
import { SelectMenuDisabledStyle } from '../../../values'

const UserInfo = () => {
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

  const UserSchema = isEditMode
    ? UserInfoEditSchema
    : UserInfoAddSchema

  const [initialValues, setInitialValues] = useState({
    ...InitialValues,
    updatedBy: currentUser.contactName,
    createdBy: currentUser.contactName,
  })

  const mounted = useRef(false)
  useEffect(() => {
    document.title = `User Info | ${APP_TITLE}`

    if (!mounted.current) {
      mounted.current = true
      return () => { }
    }

    if (parameters.id === undefined) {
      return
    } else if (state && state.mode === 0) {
      setIsViewMode(true)
    }

    setIsEditMode(true)

    FetchUserData({
      id: parameters.id,
      token: authContext.token,
      setError: setFetchError,
      setInitialValues,
      setIsGettingData,
      navigate,
    })
  }, [parameters, setInitialValues, authContext, state, navigate])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      SubmitUserData({
        token: authContext.token,
        id: parameters.id,
        values,
        isEditMode,
        navigate,
        setError,
        setIsLoading,
      })
    },
  })

  const IconStyles = {
    marginRight: '0.25rem',
    fontSize: '1.25rem',
  }

  return (
    <Container style={{
      padding: '1.25rem',
    }} >
      <Container style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
      }} >
        {
          isGettingData && isEditMode
            ?
            <div className='d-flex justify-content-center align-items-center flex-column py-3'>
              <span className='mb-2 fs-5 text-secondary'>
                {
                  fetchError.length > 0
                    ? fetchError
                    : 'Getting Data'
                }
              </span>
              {
                fetchError.length > 0
                  ? ''
                  : <BeatLoader color='#333333' size={12} />
              }
            </div>
            :
            <>
              <p className='fs-3 fw-bold text-uppercase d-inline'>
                {
                  isEditMode
                    ? isViewMode
                      ? 'View User'
                      : 'Edit User'
                    : 'Add User'
                }
              </p>
              <Form.Text className='text-danger ms-3'>{error}</Form.Text>
              <Formik enableReinitialize>
                <Form onSubmit={formik.handleSubmit} className='mt-3'>
                  <Row>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='contactName'
                        formik={formik}
                        disable={isViewMode}
                        label='Contact Name'
                        placeholder='Enter Contact Name' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='password'
                        formik={formik}
                        disable={isViewMode}
                        label='Password'
                        placeholder='Enter Password' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Phone # 1</Form.Label>
                        <InputGroup className='mb-3'>
                          <InputGroup.Text>+92</InputGroup.Text>
                          <Form.Control
                            type='text'
                            placeholder='Enter Phone # 1'
                            name='phoneNumber1'
                            onChange={formik.handleChange}
                            value={formik.values.phoneNumber1}
                            disabled={isViewMode} />
                        </InputGroup>
                        {
                          formik.errors.phoneNumber1 && formik.touched.phoneNumber1
                            ? <Form.Text className='text-danger'>{formik.errors.phoneNumber1}</Form.Text>
                            : null
                        }
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Phone # 2</Form.Label>
                        <InputGroup className='mb-3'>
                          <InputGroup.Text>+92</InputGroup.Text>
                          <Form.Control
                            type='text'
                            placeholder='Enter Phone # 2'
                            name='phoneNumber2'
                            onChange={formik.handleChange}
                            value={formik.values.phoneNumber2}
                            disabled={isViewMode} />
                        </InputGroup>
                        {
                          formik.errors.phoneNumber2 && formik.touched.phoneNumber2
                            ? <Form.Text className='text-danger'>{formik.errors.phoneNumber2}</Form.Text>
                            : null
                        }
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='landline'
                        formik={formik}
                        disable={isViewMode}
                        label='Landline'
                        placeholder='Enter Landline' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Role</Form.Label>
                        <Select
                          styles={isViewMode && SelectMenuDisabledStyle}
                          isDisabled={isViewMode}
                          key='role'
                          name='role'
                          instanceId='role'
                          isSearchable={false}
                          placeholder='Choose Role'
                          onChange={(data) => formik.setFieldValue('role', data)}
                          options={RoleOptions}
                          value={formik.values.role}
                        />
                        {
                          formik.errors.role && formik.touched.role
                            ? <Form.Text className='text-danger'>{formik.errors.role.value}</Form.Text>
                            : null
                        }
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='email'
                        formik={formik}
                        disable={isViewMode}
                        label='Email Address'
                        placeholder='Enter Email Address' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='companyName'
                        formik={formik}
                        disable={isViewMode}
                        label='Company Name'
                        placeholder='Enter Company Name' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='location'
                        formik={formik}
                        disable={isViewMode}
                        label='Location'
                        placeholder='Enter Location' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='address'
                        formik={formik}
                        disable={isViewMode}
                        label='Address'
                        placeholder='Enter Address' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='paymentMethod'
                        formik={formik}
                        disable={isViewMode}
                        label='Payment Method'
                        placeholder='Enter Payment Method' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='bankName'
                        formik={formik}
                        disable={isViewMode}
                        label='Bank Title'
                        placeholder='Enter Bank Title' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='bankBranchCode'
                        formik={formik}
                        disable={isViewMode}
                        label='Bank Branch Code'
                        placeholder='Enter Bank Branch Code' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='bankAccountNumber'
                        formik={formik}
                        disable={isViewMode}
                        label='Bank Account #'
                        placeholder='Enter Bank Account #' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Status</Form.Label>
                        <Select
                          styles={isViewMode && SelectMenuDisabledStyle}
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
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='updatedBy'
                        formik={formik}
                        disable={true}
                        label='Updated By'
                        placeholder='Enter Updated By' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField
                        name='createdBy'
                        formik={formik}
                        disable={true}
                        label='Created By'
                        placeholder='Enter Created By' />
                    </Col>
                    <Col></Col>
                    {
                      isViewMode
                        ? ''
                        :
                        <Col sm={12} md={6} lg={4} xl={3}
                          className='d-flex justify-content-end align-items-end mt-1 gap-3'>
                          <Button
                            type='reset'
                            className='text-uppercase d-flex justify-content-center align-items-center pe-3'
                            style={{
                              width: '50%',
                            }}
                            variant='danger'
                            onClick={e => setShowClearDialogue(true)}>
                            <Clear style={IconStyles} />{'Clear'}
                          </Button>
                          <Button
                            type='submit'
                            className='text-uppercase d-flex justify-content-center align-items-center pe-3'
                            style={
                              isLoading
                                ? { width: '50%', height: '2.35rem', }
                                : { width: '50%', }
                            }
                            variant='success'>
                            {
                              isLoading
                                ? <BeatLoader color='#fff' size={8} />
                                : isEditMode
                                  ? <><Save style={IconStyles} />{'Update'}</>
                                  : <><Done style={IconStyles} />{'Proceed'}</>
                            }
                          </Button>
                        </Col>}
                  </Row>
                  {
                    showClearDialogue
                      ?
                      <CustomAlertDialogue
                        title='Warning'
                        positiveMessage='Proceed'
                        negativeMessage='Cancel'
                        positiveCallback={() => {
                          setInitialValues({
                            ...InitialValues,
                            updatedBy: initialValues.updatedBy.contactName,
                            createdBy: initialValues.createdBy.contactName,
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
                      : ''
                  }
                </Form>
              </Formik>
            </>
        }
      </Container>
      <GoBackButton path='/Users' />
    </Container>
  )
}

export default UserInfo