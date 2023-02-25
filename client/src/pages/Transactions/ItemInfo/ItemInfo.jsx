import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, FieldArray } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import CreatableSelect from 'react-select/creatable'
import AsyncCreatableSelect from 'react-select/async-creatable'
import makeAnimated from 'react-select/animated'

import { AuthContext, GoBackButton, TextField } from '../../../components'
import ItemInfoSchema from './ItemInfoYupSchema'
import { FetchUnitOfMeasures, FetchUsers, FetchAttributes, FetchTags, SubmitUserData } from './ItemInfoAxios'
import { InitialValues, StatusOptions } from './ItemInfoValues'
import { API_BASE_URL, APP_TITLE } from '../../../config'
import axios from 'axios'

const animatedComponents = makeAnimated()

const TagInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')
  const parameters = useParams()
  const navigate = useNavigate()

  const authContext = useContext(AuthContext)
  const [initialValues, setInitialValues] = useState(InitialValues)

  const mounted = useRef(false)
  useEffect(() => {
    document.title = `Item Info | ${APP_TITLE}`

    if (!mounted.current) {
      mounted.current = true
      return () => { }
    }

    setIsGettingData(true)

    setIsGettingData(false)

    // if (parameters.id === undefined) return
    // setIsEditMode(true)

    // axios.get(`${API_BASE_URL}tag/${parameters.id}`, {
    //   headers: {
    //     'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
    //     'Authorization': `Bearer ${authContext.token}`
    //   },
    // }).then((response) => {
    //   if (response.status === 200) {
    //     setFetchError('')
    //     setInitialValues({
    //       name: response.data.name || '', createdBy: response.data.createdBy || '',
    //     })
    //     setIsGettingData(false)
    //   }
    // }).catch(error => setFetchError(error.response.data.message))
  }, [parameters, setInitialValues, authContext])

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: initialValues,
  //   validationSchema: TagSchema,
  //   onSubmit: async (values) => {
  //     console.log(formik.errors)

  //     setIsLoading(true)
  //     if (isEditMode) {
  //       await axios.patch(`${API_BASE_URL}tag/${parameters.id}`, JSON.stringify(values), {
  //         headers: {
  //           'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
  //           'Authorization': `Bearer ${authContext.token}`
  //         },
  //       }).then((response) => {
  //         if (response.status === 200)
  //           navigate('/Tags', { state: { message: 'Tag Updated Successfully!' }, replace: true })
  //       }).catch(error => setError(error.response.data.message))
  //     } else {
  //       await axios.post(`${API_BASE_URL}tag/`, JSON.stringify(values), {
  //         headers: {
  //           'Content-Type': 'application/json', 'Cache-Control': 'no-cache',
  //           'Authorization': `Bearer ${authContext.token}`
  //         },
  //       }).then((response) => {
  //         if (response.status === 201)
  //           navigate('/Tags', { state: { message: 'Tag Created Successfully!' }, replace: true })
  //       }).catch(error => setError(error.response.data.message))
  //     }

  //     setIsLoading(false)
  //   },
  // })

  return (
    <Container style={{ padding: '1.25rem' }} >
      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} >
        {isGettingData
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
              {isEditMode ? 'Edit Item' : 'Add Item'}
            </p>
            <Form.Text className='text-danger ms-3'>{error}</Form.Text>
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              validationSchema={ItemInfoSchema}
              onSubmit={(values) => {
                SubmitUserData({ values, isEditMode, token: authContext.token, navigate, setIsLoading, setError })
              }}
            >
              {(formik) => (
                <Form onSubmit={formik.handleSubmit} className='mt-3'>
                  <Row>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField name='name' formik={formik} label='Title' placeholder='Enter Title' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField name='minOrderNumber' formik={formik} label='Minium Order No.' placeholder='Enter Minium Order No.' />
                    </Col>
                    <Col sm={12} md={6} lg={4} xl={6}>
                      <TextField name='description' formik={formik} label='Description' placeholder='Enter Description' />
                    </Col>

                    <Col sm={12} md={6} lg={6} xl={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Unit of Measure</Form.Label>
                        <AsyncCreatableSelect
                          key='unitOfMeasure'
                          name='unitOfMeasure'
                          instanceId='unitOfMeasure'
                          placeholder='Choose Unit of Measure'
                          // cacheOptions={true}
                          value={formik.values.unitOfMeasure}
                          getOptionLabel={e => e.label}
                          getOptionValue={e => e.value}
                          onChange={(data) => formik.setFieldValue('unitOfMeasure', data)}
                          isClearable={true}
                          defaultOptions
                          loadOptions={(inputValue) => FetchUnitOfMeasures({ token: authContext.token, value: inputValue, setError })}
                        />
                        {formik.errors.unitOfMeasure && formik.touched.unitOfMeasure
                          ? <Form.Text className='text-danger'>{formik.errors.unitOfMeasure.value}</Form.Text> : null}
                        {formik.errors.unitOfMeasure && formik.touched.unitOfMeasure
                          ? <Form.Text className='text-danger'>{formik.errors.unitOfMeasure.label}</Form.Text> : null}
                      </Form.Group>
                    </Col>

                    <Col sm={12} md={12} lg={6} xl={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Tags</Form.Label>
                        <AsyncCreatableSelect
                          key='tags'
                          name='tags'
                          instanceId='tags'
                          isMulti={true}
                          placeholder='Choose Tags'
                          defaultOptions
                          // cacheOptions={true}
                          value={formik.values.tags}
                          getOptionLabel={e => e.label}
                          getOptionValue={e => e.value}
                          onChange={(data) => formik.setFieldValue('tags', data)}
                          isClearable={true}
                          loadOptions={(inputValue) => FetchTags({ token: authContext.token, value: inputValue, setError })}
                        />
                        {formik.errors.tags && formik.touched.tags
                          ? <Form.Text className='text-danger'>{formik.errors.tags}</Form.Text> : null}
                        {formik.errors.tags && formik.touched.tags && Array.isArray(formik.errors.tags)
                          ? <Form.Text className='text-danger'>{formik.errors.tags.map((tag, index) => {
                            return `${formik.getFieldMeta(`tags[${index}]`).value.label} is ${formik.getFieldMeta(`tags[${index}]`).error.label}`
                          }).join('\n')}</Form.Text> : null}
                      </Form.Group>
                    </Col>

                    <Col sm={12} md={6} lg={4} xl={3}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Vendor</Form.Label>
                        <AsyncSelect
                          cacheOptions={true}
                          value={formik.values.user}
                          getOptionLabel={e => e.label}
                          getOptionValue={e => e.value}
                          defaultOptions
                          loadOptions={(inputValue) => FetchUsers({ token: authContext.token, value: inputValue, setError })}
                          onChange={(data) => formik.setFieldValue('user', data)}
                          isClearable={true}
                        />
                        {formik.errors.user && formik.touched.user
                          ? <Form.Text className='text-danger'>{formik.errors.user.value}</Form.Text> : null}
                      </Form.Group>
                    </Col>

                    <Col sm={12} md={6} lg={4} xl={3}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Status</Form.Label>
                        <Select
                          key='status'
                          name='status'
                          instanceId='status'
                          placeholder='Choose Status'
                          onChange={(data) => formik.setFieldValue('status', data)}
                          options={StatusOptions}
                          value={formik.values.status}
                          isClearable={true}
                          isSearchable={false}
                        />
                        {formik.errors.status && formik.touched.status
                          ? <Form.Text className='text-danger'>{formik.errors.status.value}</Form.Text> : null}
                      </Form.Group>
                    </Col>

                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField name='completionDays' formik={formik}
                        label='Completion Days' placeholder='Completion Days' />
                    </Col>

                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField name='vendorPayoutPercentage' formik={formik}
                        label='Vendor Payout Percentage' placeholder='Enter Percentage' />
                    </Col>
                  </Row>

                  <Row className='border border-2'>
                    <FieldArray
                      name='attributes'
                      render={(array) => (
                        <>
                          <Col sm={12} md={6} lg={4} xl={3} className='my-3'>
                            <Button variant='success' className='w-100 text-uppercase'
                              onClick={e => {
                                array.push({
                                  id: { value: '', label: 'Choose Attribute' },
                                  value: { value: '', label: 'Enter Value' },
                                })
                              }}>Add Attribute</Button>
                            {
                              formik.errors.attributes && formik.touched.attributes && !Array.isArray(formik.errors.attributes)
                                ? <Form.Text className='text-danger'>{formik.errors.attributes}</Form.Text>
                                : null
                            }
                          </Col>
                          {formik.values.attributes.map((attribute, index) => (
                            <Col sm={12} md={6} lg={4} xl={3} className='my-3' key={`id@${index}`}>
                              <Form.Group className='mb-3'>
                                <Form.Label>Attribute No. {index + 1}</Form.Label>
                                <AsyncCreatableSelect
                                  key={`attributes[${index}].id`}
                                  name={`attributes[${index}].id`}
                                  instanceId={`attributes[${index}].id`}
                                  placeholder='Choose Attribute'
                                  // cacheOptions={true}
                                  value={formik.values.attributes[index].id}
                                  getOptionLabel={e => e.label}
                                  getOptionValue={e => e.value}
                                  onChange={(data) => formik.setFieldValue(`attributes[${index}].id`, data)}
                                  isClearable={true}
                                  defaultOptions
                                  loadOptions={(inputValue) => FetchAttributes({ token: authContext.token, value: inputValue, setError })}
                                />
                                {
                                  formik.getFieldMeta(`attributes[${index}].id`).error &&
                                    formik.getFieldMeta(`attributes[${index}].id`).touched
                                    ? <Form.Text className='text-danger'>
                                      {formik.getFieldMeta(`attributes[${index}].id`).error.value}
                                    </Form.Text>
                                    : null
                                }
                              </Form.Group>

                              <TextField name={`attributes[${index}].value`} formik={formik} label='Value'
                                placeholder='Enter Value' hasFieldArrayError={true} />
                              <Form.Group>
                                <Button variant='danger' className='w-100 text-uppercase'
                                  onClick={e => {
                                    // attributes.at(attributes.indexOf(attribute.id)).used = false
                                    array.remove(index)
                                  }}>Remove</Button>
                              </Form.Group>
                            </Col>
                          ))}
                        </>
                      )}
                    />
                  </Row>

                  <Row className='border border-2 my-3'>
                    <FieldArray
                      name='priceSlabs'
                      render={(array) => (
                        <>
                          <Col sm={12} md={6} lg={4} xl={3} className='my-3'>
                            <Button variant='success' className='w-100 text-uppercase' onClick={e => {
                              array.push({
                                slab: { value: '', label: 'Enter Slab' },
                                price: { value: '', label: 'Enter Price' },
                              })
                            }}>Add Price Slab</Button>
                            {
                              formik.errors.priceSlabs && formik.touched.priceSlabs && !Array.isArray(formik.errors.priceSlabs)
                                ? <Form.Text className='text-danger'>{formik.errors.priceSlabs}</Form.Text>
                                : null
                            }
                          </Col>
                          {formik.values.priceSlabs.map((attribute, index) => (
                            <Col sm={12} md={6} lg={4} xl={3} className='my-3' key={`id@${index}`}>
                              <TextField name={`priceSlabs[${index}].price`} formik={formik}
                                label={`Slab No. ${index + 1}`} placeholder='Enter Slab' hasFieldArrayError={true} />
                              <TextField name={`priceSlabs[${index}].slab`} formik={formik}
                                label='Price' placeholder='Enter Price' hasFieldArrayError={true} />
                              <Form.Group>
                                <Button variant='danger' className='w-100 text-uppercase'
                                  onClick={e => { array.remove(index) }}>Remove</Button>
                              </Form.Group>
                            </Col>
                          ))}
                        </>
                      )}
                    />
                  </Row>

                  <Row className='border border-2 mb-3'>
                    <FieldArray
                      name='shipmentCosts'
                      render={(array) => (
                        <>
                          <Col sm={12} md={6} lg={4} xl={3} className='my-3'>
                            <Button variant='success' className='w-100 text-uppercase' onClick={e => {
                              array.push({
                                location: { value: '', label: 'Enter Location' },
                                cost: { value: '', label: 'Enter Cost' },
                                days: { value: '', label: 'Enter Delivery Days' },
                              })
                            }}>Add Shipment Cost</Button>
                            {
                              formik.errors.shipmentCosts && formik.touched.shipmentCosts && !Array.isArray(formik.errors.shipmentCosts)
                                ? <Form.Text className='text-danger'>{formik.errors.shipmentCosts}</Form.Text>
                                : null
                            }
                          </Col>
                          {formik.values.shipmentCosts.map((attribute, index) => (
                            <Col sm={12} md={6} lg={4} xl={3} className='my-3' key={`id@${index}`}>
                              <TextField name={`shipmentCosts[${index}].location`} formik={formik}
                                label={`Location ${index + 1}`} placeholder='Enter Location' hasFieldArrayError={true} />
                              <TextField name={`shipmentCosts[${index}].cost`} formik={formik}
                                label='Cost' placeholder='Enter Cost' hasFieldArrayError={true} />
                              <TextField name={`shipmentCosts[${index}].days`} formik={formik}
                                label='Delivery Days' placeholder='Enter Delivery Days' hasFieldArrayError={true} />
                              <Form.Group>
                                <Button variant='danger' className='w-100 text-uppercase'
                                  onClick={e => { array.remove(index) }}>Remove</Button>
                              </Form.Group>
                            </Col>
                          ))}
                        </>
                      )}
                    />
                  </Row>

                  <Row>
                    <Col sm={12} md={6} lg={4} xl={3}
                      className='d-flex justify-content-end align-items-end mt-1 pb-3'>
                      <Button variant='danger' type='reset' className='w-100 me-3 text-uppercase' onClick={e => {
                        setInitialValues(InitialValues)
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
              )}
            </Formik>
          </>
        }
      </Container>
      <GoBackButton path='/Tags' />
    </Container>
  )
}

export default TagInfo