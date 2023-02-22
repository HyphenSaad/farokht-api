import React, { useState, useEffect, useContext } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'
import Select from 'react-select'

import GoBackButton from '../../components/GoBackButton'
import { API_BASE_URL } from '../../config.js'
import { AuthContext } from '../../components/ProtectedRoute.jsx'
import TextField from '../../components/TextField'

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
    minOrderNumber: Yup.number().min(1, 'Too Short!').required('Required!'),
    description: Yup.string().min(10, 'Too Short!').max(255, 'Too Long!').required('Required!'),
    unitOfMeasure: Yup.object().shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    }).required('Required!'),
    user: Yup.object().shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    }).required('Required!'),
    tags: Yup.array().of(Yup.object().shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    }).required('Required!')).min(1, 'Required!'),
  })

  const [initialValues, setInitialValues] = useState({
    name: '',
    minOrderNumber: '',
    description: '',
    unitOfMeasure: { value: '', label: 'Choose Unit of Measure' },
    tags: [],
  })

  const [users, setUsers] = useState([])
  const [tags, setTags] = useState([])
  const [unitOfMeasures, setUnitOfMeasures] = useState([])

  useEffect(() => {
    // GET USERS
    axios.get(`${API_BASE_URL}user?role=vendor&status=approved`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${authContext.token}`
      },
    }).then(response => {
      setUsers(response.data.users.map(tag => {
        return { value: tag._id, label: `${tag.firstName} ${tag.lastName}` }
      }))
    }).catch(error => {
      console.log(error)
      setError(error.response.statusText)
    })

    // GET TAGS
    axios.get(`${API_BASE_URL}tag/`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${authContext.token}`
      },
    }).then(response => {
      setTags(response.data.tags.map(tag => {
        return { value: tag._id, label: tag.name }
      }))
    }).catch(error => {
      console.log(error)
      setError(error.response.statusText)
    })

    // GET UNIT OF MEASURE
    axios.get(`${API_BASE_URL}uom/`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': `Bearer ${authContext.token}`
      },
    }).then(response => {
      setUnitOfMeasures(response.data.unitOfMeasures.map(tag => {
        return { value: tag._id, label: tag.name }
      }))
    }).catch(error => {
      console.log(error)
      setError(error.response.statusText)
    })

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
  }, [parameters, setInitialValues, authContext])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: TagSchema,
    onSubmit: async (values) => {
      console.log(formik.errors)

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
              {isEditMode ? 'Edit Item' : 'Add Item'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik enableReinitialize>
              <Form onSubmit={formik.handleSubmit} className='mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='name' formik={formik}
                      label='Title' placeholder='Enter Title' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}>
                    <TextField name='minOrderNumber' formik={formik}
                      label='Minium Order No.' placeholder='Enter Minium Order No.' />
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={6}>
                    <TextField name='description' formik={formik}
                      label='Description' placeholder='Enter Description' />
                  </Col>

                  <Col sm={12} md={6} lg={6} xl={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Unit of Measure</Form.Label>
                      <Select
                        key='unitOfMeasure'
                        name="unitOfMeasure"
                        instanceId='unitOfMeasure'
                        placeholder='Choose Unit of Measure'
                        onChange={(data) => formik.setFieldValue('unitOfMeasure', data)}
                        options={unitOfMeasures}
                        value={formik.values.unitOfMeasure}
                      />
                      {formik.errors.unitOfMeasure && formik.touched.unitOfMeasure
                        ? <Form.Text className='text-danger'>{formik.errors.unitOfMeasure.value}</Form.Text> : null}
                    </Form.Group>
                  </Col>

                  <Col sm={12} md={12} lg={6} xl={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <Select
                        key='tags'
                        name="tags"
                        instanceId='tags'
                        isMulti={true}
                        placeholder='Choose Tags'
                        onChange={(data) => formik.setFieldValue('tags', data)}
                        options={tags}
                        value={formik.values.tags}
                      />
                      {formik.errors.tags && formik.touched.tags
                        ? <Form.Text className='text-danger'>{formik.errors.tags[0].value}</Form.Text> : null}
                    </Form.Group>
                  </Col>

                  <Col sm={12} md={6} lg={4} xl={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Vendor</Form.Label>
                      <Select
                        key='user'
                        name="user"
                        instanceId='user'
                        placeholder='Choose Vendor'
                        onChange={(data) => formik.setFieldValue('user', data)}
                        options={users}
                        value={formik.values.user}
                      />
                      {formik.errors.user && formik.touched.user
                        ? <Form.Text className='text-danger'>{formik.errors.user.value}</Form.Text> : null}
                    </Form.Group>
                  </Col>

                  <Col sm={12} md={6} lg={4} xl={3}
                    className='d-flex justify-content-end align-items-end mt-1 pb-3'>
                    <Button variant='danger' type='reset' className='w-100 me-3 text-uppercase' onClick={e => {
                      setInitialValues({ name: '', })
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