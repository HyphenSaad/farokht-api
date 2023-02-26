import React, { useState, useEffect, useContext } from 'react'
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import { Save, Clear, Done } from '@mui/icons-material'

import { AuthContext, GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import { APP_TITLE } from '../../../config'
import { UserInfoAddSchema, UserInfoEditSchema } from './UserInfoYupSchema'
import { FetchUserData, SubmitUserData } from './UserInfoAxios'
import { InitialValues, RoleOptions, StatusOptions } from './UserInfoValues'

const UserInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [showClearDialogue, setShowClearDialogue] = useState(false)

  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const UserSchema = isEditMode ? UserInfoEditSchema : UserInfoAddSchema
  const [initialValues, setInitialValues] = useState(InitialValues)

  useEffect(() => {
    document.title = `User Info | ${APP_TITLE}`

    if (parameters.id === undefined) return
    setIsEditMode(true)

    FetchUserData({
      id: parameters.id,
      token: authContext.token,
      setIsGettingData,
      setInitialValues,
      setFetchError,
    })
  }, [parameters, setInitialValues, authContext])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      SubmitUserData({
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
              {isEditMode ? 'Edit User' : 'Add User'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik enableReinitialize>
              <Form onSubmit={formik.handleSubmit} className='mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='firstName' formik={formik} label='First Name' placeholder='Enter First Name' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='lastName' formik={formik} label='Last Name' placeholder='Enter Last Name' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='password' formik={formik} label='Password' placeholder='Enter Password' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Phone # 1</Form.Label>
                      <InputGroup className='mb-3'>
                        <InputGroup.Text>+92</InputGroup.Text>
                        <Form.Control type='text' placeholder='Enter Phone # 1' name='phoneNumber1'
                          onChange={formik.handleChange} value={formik.values.phoneNumber1} />
                      </InputGroup>
                      {formik.errors.phoneNumber1 && formik.touched.phoneNumber1
                        ? <Form.Text className='text-danger'>{formik.errors.phoneNumber1}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Phone # 2</Form.Label>
                      <InputGroup className='mb-3'>
                        <InputGroup.Text>+92</InputGroup.Text>
                        <Form.Control type='text' placeholder='Enter Phone # 2' name='phoneNumber2'
                          onChange={formik.handleChange} value={formik.values.phoneNumber2} />
                      </InputGroup>
                      {formik.errors.phoneNumber2 && formik.touched.phoneNumber2
                        ? <Form.Text className='text-danger'>{formik.errors.phoneNumber2}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='landline' formik={formik}
                      label='Landline' placeholder='Enter Landline' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Role</Form.Label>
                      {/* <Form.Select name='role' onChange={formik.handleChange} value={formik.values.role} >
                        <option>Select Role</option>
                        <option value='vendor'>Vendor</option>
                        <option value='retailer'>Retailer</option>
                      </Form.Select> */}
                      <Select
                        key='role'
                        name='role'
                        instanceId='role'
                        isSearchable={false}
                        placeholder='Choose Role'
                        onChange={(data) => formik.setFieldValue('role', data)}
                        options={RoleOptions}
                        value={formik.values.role}
                      />
                      {formik.errors.role && formik.touched.role
                        ? <Form.Text className='text-danger'>{formik.errors.role.value}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='email' formik={formik}
                      label='Email Address' placeholder='Enter Email Address' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='companyName' formik={formik}
                      label='Company Name' placeholder='Enter Company Name' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='location' formik={formik}
                      label='Location' placeholder='Enter Location' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='address' formik={formik}
                      label='Address' placeholder='Enter Address' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='paymentMethod' formik={formik}
                      label='Payment Method' placeholder='Enter Payment Method' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='bankName' formik={formik}
                      label='Bank Title' placeholder='Enter Bank Title' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='bankBranchCode' formik={formik}
                      label='Bank Branch Code' placeholder='Enter Bank Branch Code' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='bankAccountNumber' formik={formik}
                      label='Bank Account No.' placeholder='Enter Bank Account No.' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Status</Form.Label>
                      {/* <Form.Select name='status' onChange={formik.handleChange} value={formik.values.status} >
                        <option>Select Status</option>
                        <option value='pending'>Pending</option>
                        <option value='approved'>Approved</option>
                        <option value='suspended'>Suspended</option>
                      </Form.Select> */}
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
                    </Form.Group>
                  </Col>
                  <Col></Col>
                  <Col sm={12} md={6} lg={4} xl={3}
                    className='d-flex justify-content-end align-items-end mt-1 gap-3'>
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
                  </Col>
                </Row>
                {showClearDialogue ?
                  <CustomAlertDialogue
                    title='Warning'
                    positiveMessage='Proceed'
                    negativeMessage='Cancel'
                    positiveCallback={() => {
                      setInitialValues({
                        firstName: '', lastName: '', password: '', phoneNumber1: '', phoneNumber2: '',
                        landline: '', location: '', address: '', email: '', companyName: '',
                        paymentMethod: '', bankName: '', bankBranchCode: '', bankAccountNumber: '',
                        role: { value: '', label: 'Choose Role' },
                        status: { value: '', label: 'Choose Status' },
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
      <GoBackButton path='/Users' />
    </Container>
  )
}

export default UserInfo