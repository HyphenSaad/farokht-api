import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, FieldArray } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { Add, Delete, Save, Clear, Done } from '@mui/icons-material'

import { AuthContext, GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import ItemInfoSchema from './ItemInfoYupSchema'
import { FetchUnitOfMeasures, FetchUsers, FetchAttributes, FetchTags, SubmitUserData, FetchItemData } from './ItemInfoAxios'
import { InitialValues, StatusOptions } from './ItemInfoValues'
import { APP_TITLE } from '../../../config'

const TagInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')
  const [showClearDialogue, setShowClearDialogue] = useState(false)

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

    if (parameters.id === undefined) return
    setIsEditMode(true)

    FetchItemData({
      token: authContext.token,
      id: parameters.id,
      setFetchError, setIsGettingData, setInitialValues
    })
  }, [parameters, setInitialValues, authContext])

  return (
    <Container style={{ padding: '1.25rem' }} >
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={ItemInfoSchema}
        onSubmit={(values) => {
          SubmitUserData({ values, isEditMode, token: authContext.token, navigate, setIsLoading, setError, id: parameters.id, })
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit} className='m-0 p-0'>
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
                    {isEditMode ? 'Edit Item' : 'Add Item'}
                  </p>
                  <Form.Text className='text-danger ms-3'>{error}</Form.Text>
                  <Row className='mt-2'>
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
                          value={formik.values.unitOfMeasure}
                          defaultValue={formik.values.unitOfMeasure}
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
                          value={formik.values.user}
                          defaultValue={formik.values.user}
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
                      <TextField name='completionDays' formik={formik}
                        label='Completion Days' placeholder='Completion Days' />
                    </Col>

                    <Col sm={12} md={6} lg={4} xl={3}>
                      <TextField name='vendorPayoutPercentage' formik={formik}
                        label='Vendor Payout Percentage' placeholder='Enter Percentage' />
                    </Col>
                  </Row>
                </>
              }
            </Container>

            {isGettingData ? '' :
              <>
                <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                  <FieldArray
                    name='attributes'
                    render={(array) => (
                      <>
                        <Container className='m-0 p-0 d-flex justify-content-between align-items-center'>
                          <p className='m-0 p-0 text-uppercase fw-bold' style={{ fontSize: '1.3rem' }}>Attributes</p>
                          <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                            variant='primary'
                            onClick={e => {
                              array.push({
                                id: { value: '', label: 'Choose Attribute' },
                                value: '',
                              })
                            }}>
                            <Add style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Add
                          </Button>
                        </Container>
                        {
                          formik.errors.attributes && formik.touched.attributes && !Array.isArray(formik.errors.attributes)
                            ? <Form.Text className='text-danger'>{formik.errors.attributes}</Form.Text>
                            : null
                        }
                        <Row>
                          {formik.values.attributes.map((attribute, index) => (
                            <Col sm={12} md={6} lg={4} xl={3} className='mt-3' key={`id@${index}`}>
                              <Form.Group className='mb-3'>
                                <Form.Label>Attribute No. {index + 1}</Form.Label>
                                <AsyncCreatableSelect
                                  key={`attributes[${index}].id`}
                                  name={`attributes[${index}].id`}
                                  instanceId={`attributes[${index}].id`}
                                  placeholder='Choose Attribute'
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

                              <TextField
                                value={formik.values.attributes[index].value}
                                name={`attributes[${index}].value`}
                                formik={formik}
                                label='Value'
                                placeholder='Enter Value'
                                hasFieldArrayError={true}
                              />
                              <Form.Group>
                                <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                                  style={{ width: '50%' }}
                                  variant='danger'
                                  onClick={e => { array.remove(index) }}>
                                  <Delete style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Remove
                                </Button>
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                  />
                </Container>

                <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                  <FieldArray
                    name='priceSlabs'
                    render={(array) => {
                      return (
                        <>
                          <Container className='m-0 p-0 d-flex justify-content-between align-items-center'>
                            <p className='m-0 p-0 text-uppercase fw-bold' style={{ fontSize: '1.3rem' }}>Price Slabs</p>
                            <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                              variant='primary' onClick={e => {
                                array.push({ slab: '', price: '', })
                              }}>
                              <Add style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Add
                            </Button>
                          </Container>
                          {
                            formik.errors.priceSlabs && formik.touched.priceSlabs && !Array.isArray(formik.errors.priceSlabs)
                              ? <Form.Text className='text-danger'>{formik.errors.priceSlabs}</Form.Text>
                              : null
                          }
                          <Row>
                            {formik.values.priceSlabs.map((attribute, index) => (
                              <Col sm={12} md={6} lg={4} xl={3} className='mt-3' key={`id@${index}`}>
                                <TextField
                                  value={formik.values.priceSlabs[index].price}
                                  name={`priceSlabs[${index}].price`}
                                  formik={formik}
                                  label={`Slab No. ${index + 1}`}
                                  placeholder='Enter Slab'
                                  hasFieldArrayError={true} />
                                <TextField
                                  value={formik.values.priceSlabs[index].slab}
                                  name={`priceSlabs[${index}].slab`}
                                  formik={formik}
                                  label='Price'
                                  placeholder='Enter Price'
                                  hasFieldArrayError={true} />
                                <Form.Group>
                                  <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                                    style={{ width: '50%' }}
                                    variant='danger'
                                    onClick={e => { array.remove(index) }}>
                                    <Delete style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Remove
                                  </Button>
                                </Form.Group>
                              </Col>
                            ))}
                          </Row>
                        </>)
                    }}
                  />
                </Container>

                <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                  <FieldArray
                    name='shipmentCosts'
                    render={(array) => (
                      <>
                        <Container className='m-0 p-0 d-flex justify-content-between align-items-center'>
                          <p className='m-0 p-0 text-uppercase fw-bold' style={{ fontSize: '1.3rem' }}>Shipment Cost</p>
                          <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                            variant='primary' onClick={e => {
                              array.push({ location: '', cost: '', days: '', })
                            }}>
                            <Add style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Add
                          </Button>
                        </Container>
                        {
                          formik.errors.shipmentCosts && formik.touched.shipmentCosts && !Array.isArray(formik.errors.shipmentCosts)
                            ? <Form.Text className='text-danger'>{formik.errors.shipmentCosts}</Form.Text>
                            : null
                        }
                        <Row>
                          {formik.values.shipmentCosts.map((attribute, index) => (
                            <Col sm={12} md={6} lg={4} xl={3} className='mt-3' key={`id@${index}`}>
                              <TextField
                                value={formik.values.shipmentCosts[index].location}
                                name={`shipmentCosts[${index}].location`}
                                formik={formik}
                                label={`Location ${index + 1}`}
                                placeholder='Enter Location'
                                hasFieldArrayError={true} />
                              <TextField
                                value={formik.values.shipmentCosts[index].cost}
                                name={`shipmentCosts[${index}].cost`}
                                formik={formik}
                                label='Cost'
                                placeholder='Enter Cost'
                                hasFieldArrayError={true} />
                              <TextField
                                value={formik.values.shipmentCosts[index].days}
                                name={`shipmentCosts[${index}].days`}
                                formik={formik}
                                label='Delivery Days'
                                placeholder='Enter Delivery Days'
                                hasFieldArrayError={true} />
                              <Form.Group>
                                <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                                  style={{ width: '50%' }}
                                  variant='danger'
                                  onClick={e => { array.remove(index) }}>
                                  <Delete style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Remove
                                </Button>
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                  />
                </Container>

                <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                  <Row>
                    <Col sm={12} md={6} lg={4} xl={3}
                      className='d-flex justify-content-end align-items-end gap-3'>
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
                </Container>
              </>
            }

            {showClearDialogue ?
              <CustomAlertDialogue
                title='Warning'
                positiveMessage='Proceed'
                negativeMessage='Cancel'
                positiveCallback={() => {
                  setInitialValues(InitialValues)
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
            <GoBackButton path='/Items' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default TagInfo