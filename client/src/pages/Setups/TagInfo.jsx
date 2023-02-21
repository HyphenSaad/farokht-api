import React, { useState, useEffect, useContext } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { BeatLoader } from 'react-spinners'
import GoBackButton from '../../components/GoBackButton'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../../config.js'
import { AuthContext } from '../../components/ProtectedRoute.jsx'

const TagInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')
  const parameters = useParams()
  const navigate = useNavigate()

  const authContext = useContext(AuthContext)

  const TagSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Too Short!').max(25, 'Too Long!').required('Required!'),
  })

  const currentUser = JSON.parse(localStorage.getItem('userData')).user
  const [initialValues, setInitialValues] = useState({
    name: '', createdBy: `${currentUser.firstName} ${currentUser.lastName}`
  })

  useEffect(() => {
    if (parameters.id === undefined) return
    setIsEditMode(true)
    setIsGettingData(true)

    axios.get(`${API_BASE_URL}tag/${parameters.id}`, {
      headers: {
        'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${authContext.token}`
      },
    }).then((response) => {
      if (response.status === 200) {
        setFetchError('')
        setInitialValues({
          name: response.data.name || '', createdBy: response.data.createdBy || '',
        })
        setIsGettingData(false)
      }
    }).catch(error => setFetchError(error.response.data.message))
  }, [parameters, setInitialValues])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: TagSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      if (isEditMode) {
        await axios.patch(`${API_BASE_URL}tag/${parameters.id}`, JSON.stringify(values), {
          headers: {
            'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${authContext.token}`
          },
        }).then((response) => {
          if (response.status === 200)
            navigate('/Tags', { state: { message: 'Tag Updated Successfully!' }, replace: true })
        }).catch(error => setError(error.response.data.message))
      } else {
        await axios.post(`${API_BASE_URL}tag/`, JSON.stringify(values), {
          headers: {
            'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
            'Authorization': `Bearer ${authContext.token}`
          },
        }).then((response) => {
          if (response.status === 201)
            navigate('/Tags', { state: { message: 'Tag Created Successfully!' }, replace: true })
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
              {isEditMode ? 'Edit Tag' : 'Add Tag'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik enableReinitialize>
              <Form onSubmit={formik.handleSubmit} className='mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tag Title</Form.Label>
                      <Form.Control type="text" placeholder="Enter Tag Title" name='name'
                        onChange={formik.handleChange} value={formik.values.name} />
                      {formik.errors.name && formik.touched.name
                        ? <Form.Text className='text-danger'>{formik.errors.name}</Form.Text> : null}
                    </Form.Group>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Created By</Form.Label>
                      <Form.Control type="text" placeholder="Enter Created By" name='createdBy'
                        onChange={formik.handleChange} value={formik.values.createdBy} disabled />
                      {formik.errors.createdBy && formik.touched.createdBy
                        ? <Form.Text className='text-danger'>{formik.errors.createdBy}</Form.Text> : null}
                    </Form.Group>
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
      <GoBackButton path='/Tags' />
    </Container>
  )
}

export default TagInfo