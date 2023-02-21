import React, { useState, useEffect, useContext } from 'react'
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { BeatLoader } from 'react-spinners'
import GoBackButton from '../../components/GoBackButton'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config.js'
import { AuthContext } from '../../components/ProtectedRoute.jsx'

const UserInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')
  const parameters = useParams()
  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const UserSchema = Yup.object().shape({
    firstName: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Only Alphabets Allowed!').min(3, 'Too Short!').max(20, 'Too Long!').required('Required!'),
    lastName: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Only Alphabets Allowed!').min(3, 'Too Short!').max(20, 'Too Long!').required('Required!'),
    phoneNumber1: Yup.string().matches(/^[0-9]+$/, 'Only Digits Allowed!').min(10, 'Too Short!').max(10, 'Too Long!').required('Required!'),
    phoneNumber2: Yup.string().matches(/^[0-9]+$/, 'Only Digits Allowed!').min(10, 'Too Short!').max(10, 'Too Long!'),
    landline: Yup.string().matches(/^[0-9]+$/, 'Only Digits Allowed!').min(9, 'Too Short!').max(11, 'Too Long!'),
    email: Yup.string().email('Invalid Email!').min(5, 'Too Short!').max(50, 'Too Long!').required('Required!'),
    password: isEditMode ? Yup.string().min(8, 'Too Short!') : Yup.string().min(8, 'Too Short!').required('Required!'),
    role: Yup.mixed().oneOf(['retailer', 'vendor'], 'Invalid Role!').required('Required!'),
    companyName: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required!'),
    location: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required!'),
    address: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required!'),
    paymentMethod: Yup.string().min(3, 'Too Short!').max(50, 'Too Long!').required('Required!'),
    bankName: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Only Alphabets Allowed!').min(3, 'Too Short!').max(50, 'Too Long!').required('Required!'),
    bankBranchCode: Yup.string().matches(/^[0-9]+$/, 'Only Digits Allowed!').min(4, 'Too Short!').max(7, 'Too Long!').required('Required!'),
    bankAccountNumber: Yup.string().matches(/^[0-9]+$/, 'Only Digits Allowed!').min(10, 'Too Short!').max(15, 'Too Long!').required('Required!'),
  })

  const [initialValues, setInitialValues] = useState({
    firstName: '', lastName: '', password: '', phoneNumber1: '', phoneNumber2: '', landline: '', role: '', location: '',
    address: '', email: '', companyName: '', paymentMethod: '', bankName: '', bankBranchCode: '', bankAccountNumber: '', status: '',
  })

  useEffect(() => {
    if (parameters.id === undefined) return
    setIsEditMode(true)
    setIsGettingData(true)

    axios.get(`${API_BASE_URL}user/${parameters.id}`, {
      headers: {
        'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${authContext.token}`
      },
    }).then((response) => {
      if (response.status === 200) {
        setFetchError('')
        setInitialValues({
          firstName: response.data.firstName || '', lastName: response.data.lastName || '',
          password: response.data.password || '', phoneNumber1: response.data.phoneNumber1 || '',
          phoneNumber2: response.data.phoneNumber2 || '', landline: response.data.landline || '',
          role: response.data.role || '', location: response.data.location || '',
          address: response.data.address || '', email: response.data.email || '',
          companyName: response.data.companyName || '', paymentMethod: response.data.paymentMethod || '',
          bankName: response.data.bankName || '', bankBranchCode: response.data.bankBranchCode || '',
          bankAccountNumber: response.data.bankAccountNumber || '', status: response.data.status || '',
        })
        setIsGettingData(false)
      }
    }).catch(error => setFetchError(error.response.data.message))
  }, [parameters, setInitialValues, authContext])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: UserSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      if (isEditMode) {
        await axios.patch(`${API_BASE_URL}user/${parameters.id}`, JSON.stringify(values), {
          headers: {
            'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${authContext.token}`
          },
        }).then((response) => {
          if (response.status === 200)
            navigate('/Users', { state: { message: 'User Updated Successfully!' }, replace: true })
        }).catch(error => setError(error.response.data.message))
      } else {
        await axios.post(`${API_BASE_URL}user/`, JSON.stringify(values), {
          headers: {
            'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${authContext.token}`
          },
        }).then((response) => {
          if (response.status === 201)
            navigate('/Users', { state: { message: 'User Created Successfully!' }, replace: true })
        }).catch(error => setError(error.response.data.message))
      }

      setIsLoading(false)
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
              {isEditMode ? 'Edit User' : 'Add User'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik enableReinitialize>
              <Form onSubmit={formik.handleSubmit} className='mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter First Name" name='firstName'
                        onChange={formik.handleChange} value={formik.values.firstName} />
                      {formik.errors.firstName && formik.touched.firstName
                        ? <Form.Text className='text-danger'>{formik.errors.firstName}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter Last Name" name='lastName'
                        onChange={formik.handleChange} value={formik.values.lastName} />
                      {formik.errors.lastName && formik.touched.lastName
                        ? <Form.Text className='text-danger'>{formik.errors.lastName}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="text" placeholder="Enter Password" name='password'
                        onChange={formik.handleChange} value={formik.values.password} />
                      {formik.errors.password && formik.touched.password
                        ? <Form.Text className='text-danger'>{formik.errors.password}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  {/* </Row> */}

                  {/* <Row> */}
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone # 1</Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>+92</InputGroup.Text>
                        <Form.Control type="text" placeholder="Enter Phone # 1" name='phoneNumber1'
                          onChange={formik.handleChange} value={formik.values.phoneNumber1} />
                      </InputGroup>
                      {formik.errors.phoneNumber1 && formik.touched.phoneNumber1
                        ? <Form.Text className='text-danger'>{formik.errors.phoneNumber1}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone # 2</Form.Label>
                      <InputGroup className="mb-3">
                        <InputGroup.Text>+92</InputGroup.Text>
                        <Form.Control type="text" placeholder="Enter Phone # 2" name='phoneNumber2'
                          onChange={formik.handleChange} value={formik.values.phoneNumber2} />
                      </InputGroup>
                      {formik.errors.phoneNumber2 && formik.touched.phoneNumber2
                        ? <Form.Text className='text-danger'>{formik.errors.phoneNumber2}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Landline #</Form.Label>
                      <Form.Control type="text" placeholder="Enter Landline #" name='landline'
                        onChange={formik.handleChange} value={formik.values.landline} />
                      {formik.errors.landline && formik.touched.landline
                        ? <Form.Text className='text-danger'>{formik.errors.landline}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  {/* </Row> */}

                  {/* <Row> */}
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Select name='role' onChange={formik.handleChange} value={formik.values.role} >
                        <option>Select Role</option>
                        <option value="vendor">Vendor</option>
                        <option value="retailer">Retailer</option>
                      </Form.Select>
                      {formik.errors.role && formik.touched.role
                        ? <Form.Text className='text-danger'>{formik.errors.role}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="text" placeholder="Enter Email" name='email'
                        onChange={formik.handleChange} value={formik.values.email} />
                      {formik.errors.email && formik.touched.email
                        ? <Form.Text className='text-danger'>{formik.errors.email}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter Company Name" name='companyName'
                        onChange={formik.handleChange} value={formik.values.companyName} />
                      {formik.errors.companyName && formik.touched.companyName
                        ? <Form.Text className='text-danger'>{formik.errors.companyName}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  {/* </Row> */}

                  {/* <Row> */}
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control type="text" placeholder="Enter Location" name='location'
                        onChange={formik.handleChange} value={formik.values.location} />
                      {formik.errors.location && formik.touched.location
                        ? <Form.Text className='text-danger'>{formik.errors.location}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control type="text" placeholder="Enter Address" name='address'
                        onChange={formik.handleChange} value={formik.values.address} />
                      {formik.errors.address && formik.touched.address
                        ? <Form.Text className='text-danger'>{formik.errors.address}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Payment Method</Form.Label>
                      <Form.Control type="text" placeholder="Enter Payment Method" name='paymentMethod'
                        onChange={formik.handleChange} value={formik.values.paymentMethod} />
                      {formik.errors.paymentMethod && formik.touched.paymentMethod
                        ? <Form.Text className='text-danger'>{formik.errors.paymentMethod}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  {/* </Row> */}

                  {/* <Row> */}
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Title</Form.Label>
                      <Form.Control type="text" placeholder="Enter Bank Title" name='bankName'
                        onChange={formik.handleChange} value={formik.values.bankName} />
                      {formik.errors.bankName && formik.touched.bankName
                        ? <Form.Text className='text-danger'>{formik.errors.bankName}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Branch Code</Form.Label>
                      <Form.Control type="text" placeholder="Enter Bank Branch Code" name='bankBranchCode'
                        onChange={formik.handleChange} value={formik.values.bankBranchCode} />
                      {formik.errors.bankBranchCode && formik.touched.bankBranchCode
                        ? <Form.Text className='text-danger'>{formik.errors.bankBranchCode}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Account No.</Form.Label>
                      <Form.Control type="text" placeholder="Enter Bank Account No." name='bankAccountNumber'
                        onChange={formik.handleChange} value={formik.values.bankAccountNumber} />
                      {formik.errors.bankAccountNumber && formik.touched.bankAccountNumber
                        ? <Form.Text className='text-danger'>{formik.errors.bankAccountNumber}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  {/* </Row> */}

                  {/* <Row> */}
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select name='status' onChange={formik.handleChange} value={formik.values.status} >
                        <option>Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="suspended">Suspended</option>
                      </Form.Select>
                      {formik.errors.status && formik.touched.status
                        ? <Form.Text className='text-danger'>{formik.errors.status}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col></Col>
                  <Col sm={12} md={6} lg={4} xl={3}
                    className='d-flex justify-content-end align-items-end mt-1 pb-3'>
                    <Button variant='danger' type='reset' className='w-100 me-3 text-uppercase' onClick={e => {
                      setInitialValues({
                        firstName: '', lastName: '', password: '', phoneNumber1: '', phoneNumber2: '', landline: '', role: '', location: '',
                        address: '', email: '', companyName: '', paymentMethod: '', bankName: '', bankBranchCode: '', bankAccountNumber: '', status: '',
                      })
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
      <GoBackButton path='/Users' />
    </Container>
  )
}

export default UserInfo