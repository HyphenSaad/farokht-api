import React, { useState, useEffect, useContext, useRef } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik, FieldArray } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import AsyncCreatableSelect from 'react-select/async-creatable'
import { Add, Delete, Save, Clear, Done } from '@mui/icons-material'

import { AuthContext, GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import ItemInfoSchema from './ItemInfoYupSchema'
import {
  FetchUnitOfMeasures, FetchUsers, FetchAttributes, FetchTags,
  SubmitUserData, FetchItemData, FetchShipmentCosts
} from './ItemInfoAxios'
import { InitialValues, StatusOptions } from './ItemInfoValues'
import { APP_TITLE } from '../../../config'

const TagInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')
  const [showClearDialogue, setShowClearDialogue] = useState(false)
  const [showUpdateDialogue, setShowUpdateDialogue] = useState(false)

  const parameters = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const authContext = useContext(AuthContext)
  const currentUser = authContext.user

  const [initialValues, setInitialValues] = useState({
    ...InitialValues,
    updatedBy: currentUser.contactName || '',
    createdBy: currentUser.contactName || '',
  })

  const mounted = useRef(false)
  useEffect(() => {
    document.title = `Item Info | ${APP_TITLE}`

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

    FetchItemData({
      token: authContext.token,
      id: parameters.id,
      setError: setFetchError,
      setIsGettingData,
      setInitialValues,
      navigate
    })
  }, [parameters, setInitialValues, authContext, state, navigate])

  const IconStyles = {
    marginRight: '0.25rem',
    fontSize: '1.25rem',
  }

  const [attributeValueIndex, setAttributeValueIndex] = useState(0)

  return (
    <Container style={{
      padding: '1.25rem',
    }}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={ItemInfoSchema}
        onSubmit={(values) => {
          setShowUpdateDialogue(true)
        }}>
        {(formik) => (
          <Form onSubmit={formik.handleSubmit} className='m-0 p-0'>
            <Container style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '0.5rem',
            }}>
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
                            ? 'View Item'
                            : 'Edit Item'
                          : 'Add Item'
                      }
                    </p>
                    <Form.Text className='text-danger ms-3'>{error}</Form.Text>
                    <Row className='mt-2'>
                      <Col sm={12} md={6} lg={4} xl={6}>
                        <TextField
                          name='name'
                          formik={formik}
                          disable={isViewMode}
                          label='Title'
                          placeholder='Enter Title' />
                      </Col>
                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='minOrderQuantity'
                          formik={formik}
                          disable={isViewMode}
                          label='Minimum Order Quantity'
                          placeholder='Enter Minimum Order Quantity' />
                      </Col>
                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='maxOrderQuantity'
                          formik={formik}
                          disable={isViewMode}
                          label='Maximum Order Quantity'
                          placeholder='Enter Maximum Order Quantity' />
                      </Col>
                      <Col sm={12} md={6} lg={8} xl={6}>
                        <TextField
                          name='description'
                          formik={formik}
                          disable={isViewMode}
                          label='Description'
                          placeholder='Enter Description' />
                      </Col>
                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='completionDays'
                          formik={formik}
                          disable={isViewMode}
                          label='Completion Days'
                          placeholder='Completion Days' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='vendorPayoutPercentage'
                          formik={formik}
                          disable={isViewMode}
                          label='Vendor Payout Percentage'
                          placeholder='Enter Percentage' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Vendor</Form.Label>
                          <AsyncSelect
                            isDisabled={isViewMode}
                            value={formik.values.user}
                            defaultValue={formik.values.user}
                            getOptionLabel={e => e.label}
                            getOptionValue={e => e.value}
                            defaultOptions
                            loadOptions={(inputValue) => FetchUsers({
                              token: authContext.token,
                              value: inputValue,
                              setError,
                              navigate,
                            })}
                            onChange={(data) => formik.setFieldValue('user', data)}
                            isClearable={true}
                          />
                          {
                            formik.errors.user && formik.touched.user
                              ? <Form.Text className='text-danger'>{formik.errors.user.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Unit of Measure</Form.Label>
                          <AsyncCreatableSelect
                            isDisabled={isViewMode}
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
                            loadOptions={(inputValue) => FetchUnitOfMeasures({
                              token: authContext.token,
                              value: inputValue,
                              setError,
                              navigate,
                            })}
                          />
                          {
                            formik.errors.unitOfMeasure && formik.touched.unitOfMeasure
                              ? <Form.Text className='text-danger'>{formik.errors.unitOfMeasure.value}</Form.Text>
                              : null
                          }
                          {
                            formik.errors.unitOfMeasure && formik.touched.unitOfMeasure
                              ? <Form.Text className='text-danger'>{formik.errors.unitOfMeasure.label}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={12} lg={8} xl={6}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Tags</Form.Label>
                          <AsyncCreatableSelect
                            isDisabled={isViewMode}
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
                            loadOptions={(inputValue) => FetchTags({
                              token: authContext.token,
                              value: inputValue,
                              setError,
                              navigate,
                            })}
                          />
                          {
                            formik.errors.tags && formik.touched.tags
                              ? <Form.Text className='text-danger'>{formik.errors.tags}</Form.Text>
                              : null
                          }
                          {
                            formik.errors.tags && formik.touched.tags && Array.isArray(formik.errors.tags)
                              ?
                              <Form.Text className='text-danger'>
                                {
                                  formik.errors.tags.map((tag, index) => {
                                    const __label = formik.getFieldMeta(`tags[${index}]`).value.label
                                    const __error = formik.getFieldMeta(`tags[${index}]`).error.label
                                    return `${__label} is ${__error}`
                                  }).join('\n')
                                }
                              </Form.Text>
                              : null
                          }
                        </Form.Group>
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
                          {
                            formik.errors.status && formik.touched.status
                              ? <Form.Text className='text-danger'>{formik.errors.status.value}</Form.Text>
                              : null
                          }
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
                    </Row>
                  </>
              }
            </Container>

            {
              isGettingData && isEditMode
                ? ''
                :
                <>
                  <Container style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                  }} className='mt-3'>
                    <FieldArray
                      name='attributes'
                      render={(array) => (
                        <>
                          <Container className='m-0 p-0 d-flex justify-content-between align-items-center'>
                            <p className='m-0 p-0 text-uppercase fw-bold'
                              style={{
                                fontSize: '1.3rem',
                              }}>
                              Attributes
                            </p>
                            {
                              isViewMode
                                ? ''
                                :
                                <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                                  variant='primary'
                                  onClick={e => {
                                    array.push({
                                      id: {
                                        value: '',
                                        label: 'Choose Attribute',
                                      },
                                      values: [''],
                                    })
                                  }}>
                                  <Add style={IconStyles} />Add
                                </Button>}
                          </Container>
                          {
                            formik.errors.attributes
                              && formik.touched.attributes
                              && !Array.isArray(formik.errors.attributes)
                              ?
                              <Form.Text className='text-danger'>
                                {formik.errors.attributes}
                              </Form.Text>
                              : null
                          }
                          <Row>
                            {
                              formik.values.attributes.map((attribute, index) => (
                                <Col
                                  sm={12} md={6} lg={4} xl={3}
                                  className='mt-3'
                                  key={`id@${index}`}>
                                  <Form.Group className='mb-3'>
                                    <Form.Label>Attribute No. {index + 1}</Form.Label>
                                    <AsyncCreatableSelect
                                      isDisabled={isViewMode}
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
                                      loadOptions={(inputValue) => FetchAttributes({
                                        token: authContext.token,
                                        value: inputValue,
                                        setError,
                                        navigate,
                                      })}
                                    />
                                    {
                                      formik.getFieldMeta(`attributes[${index}].id`).error
                                        && formik.getFieldMeta(`attributes[${index}].id`).touched
                                        ?
                                        <Form.Text className='text-danger d-block'>
                                          {formik.getFieldMeta(`attributes[${index}].id`).error.value}
                                        </Form.Text>
                                        : null
                                    }
                                  </Form.Group>

                                  <FieldArray
                                    name={`attributes[${index}].values`}
                                    key={`attributes[${index}].values`}>
                                    {(arrayHelpers) => (
                                      <>
                                        {
                                          formik.values.attributes[index].values.map((value, _index) => (
                                            <>
                                              <Form.Group className='mb-3' key={`attributes[${index}].values[${_index}]`}>
                                                <Form.Label>{`Value No. ${_index + 1}`}</Form.Label>
                                                <Container className='m-0 p-0 d-flex gap-2'>
                                                  <Form.Control
                                                    type='text'
                                                    placeholder={`Enter Value No. ${_index + 1}`}
                                                    name={`attributes[${index}].values[${_index}]`}
                                                    onChange={formik.handleChange}
                                                    value={formik.values.attributes[index].values[_index]}
                                                    disabled={isViewMode} />
                                                  <Button className='btn-sm d-inline-flex justify-content-center align-items-center'
                                                    style={{
                                                      width: '2.25rem',
                                                      textTransform: 'uppercase',
                                                    }}
                                                    disabled={isViewMode}
                                                    variant='warning'
                                                    onClick={e => { arrayHelpers.remove(_index) }}>
                                                    <Clear style={{ ...IconStyles, margin: 0 }} />
                                                  </Button>
                                                </Container>
                                                {
                                                  formik.getFieldMeta(`attributes[${index}].values[${_index}]`).error
                                                    && formik.getFieldMeta(`attributes[${index}].values[${_index}]`).touched
                                                    ?
                                                    <Form.Text className='text-danger'>
                                                      {formik.getFieldMeta(`attributes[${index}].values[${_index}]`).error}
                                                    </Form.Text>
                                                    : null
                                                }
                                              </Form.Group>
                                            </>
                                          ))
                                        }
                                        {
                                          isViewMode
                                            ? ''
                                            :
                                            <Form.Group key={`attributes[${index}].values`}
                                              className='d-flex justify-content-stretch align-items-center gap-3'>
                                              <Button className='btn-sm d-inline-flex justify-content-center align-items-center pe-3'
                                                style={{
                                                  width: '100%',
                                                  textTransform: 'uppercase',
                                                }}
                                                variant='danger'
                                                onClick={e => { array.remove(index) }}>
                                                <Delete style={IconStyles} />Remove
                                              </Button>
                                              <Button className='btn-sm d-inline-flex justify-content-center align-items-center pe-3'
                                                style={{
                                                  width: '100%',
                                                  textTransform: 'uppercase',
                                                }}
                                                variant='success'
                                                onClick={() => {
                                                  arrayHelpers.push(formik.values.attributes[index].values[attributeValueIndex])
                                                  setAttributeValueIndex(attributeValueIndex + 1)
                                                }}>
                                                <Add style={IconStyles} />Add
                                              </Button>
                                            </Form.Group>
                                        }
                                      </>
                                    )}
                                  </FieldArray>
                                </Col>
                              ))
                            }
                          </Row>
                        </>
                      )}
                    />
                  </Container>

                  <Container style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                  }} className='mt-3'>
                    <FieldArray
                      name='priceSlabs'
                      render={(array) => {
                        return (
                          <>
                            <Container className='m-0 p-0 d-flex justify-content-between align-items-center'>
                              <p className='m-0 p-0 text-uppercase fw-bold'
                                style={{
                                  fontSize:
                                    '1.3rem',
                                }}>
                                Price Slabs
                              </p>
                              {
                                isViewMode
                                  ? ''
                                  :
                                  <Button
                                    className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                                    variant='primary'
                                    onClick={e => {
                                      array.push({
                                        slab: '',
                                        price: '',
                                      })
                                    }}>
                                    <Add style={IconStyles} />Add
                                  </Button>}
                            </Container>
                            {
                              formik.errors.priceSlabs
                                && formik.touched.priceSlabs
                                && !Array.isArray(formik.errors.priceSlabs)
                                ?
                                <Form.Text className='text-danger'>
                                  {formik.errors.priceSlabs}
                                </Form.Text>
                                : null
                            }
                            <Row>
                              {
                                formik.values.priceSlabs.map((attribute, index) => (
                                  <Col sm={12} md={6} lg={4} xl={3}
                                    className='mt-3'
                                    key={`id@${index}`}>
                                    <TextField
                                      disable={isViewMode}
                                      value={formik.values.priceSlabs[index].slab}
                                      name={`priceSlabs[${index}].slab`}
                                      formik={formik}
                                      label={`Slab No. ${index + 1}`}
                                      placeholder='Enter Slab'
                                      hasFieldArrayError={true} />
                                    <TextField
                                      disable={isViewMode}
                                      value={formik.values.priceSlabs[index].price}
                                      name={`priceSlabs[${index}].price`}
                                      formik={formik}
                                      label='Price'
                                      placeholder='Enter Price'
                                      hasFieldArrayError={true} />
                                    {
                                      isViewMode
                                        ? ''
                                        :
                                        <Form.Group>
                                          <Button className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                                            style={{ width: '50%' }}
                                            variant='danger'
                                            onClick={e => { array.remove(index) }}>
                                            <Delete style={IconStyles} />Remove
                                          </Button>
                                        </Form.Group>
                                    }
                                  </Col>
                                ))
                              }
                            </Row>
                          </>)
                      }}
                    />
                  </Container>

                  <Container style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '0.5rem'
                  }} className='mt-3'>
                    <FieldArray
                      name='shipmentCosts'
                      render={(array) => (
                        <>
                          <Container className='m-0 p-0 d-flex justify-content-between align-items-center'>
                            <p className='m-0 p-0 text-uppercase fw-bold'
                              style={{
                                fontSize: '1.3rem',
                              }}>
                              Shipment Costs
                            </p>
                            {
                              isViewMode
                                ? ''
                                :
                                <Button
                                  className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3'
                                  variant='primary'
                                  onClick={e => {
                                    array.push({
                                      value: '',
                                      label: 'Choose Shipment Preset',
                                      maxCost: '',
                                      minCost: '',
                                    })
                                  }}>
                                  <Add style={IconStyles} />Add
                                </Button>}
                          </Container>
                          {
                            formik.errors.shipmentCosts && formik.touched.shipmentCosts
                              && !Array.isArray(formik.errors.shipmentCosts)
                              ? <Form.Text className='text-danger'>{formik.errors.shipmentCosts}</Form.Text>
                              : null
                          }
                          {
                            formik.values.shipmentCosts.map((shipmentCost, index) => (
                              <Row className='mt-3' key={`id@${index}`}>
                                <Col sm={12} md={12} lg={6} xl={4}>
                                  <Form.Group className='mb-3'>
                                    <Form.Label>Shipment Cost No. {index + 1}</Form.Label>
                                    <AsyncCreatableSelect
                                      isDisabled={isViewMode}
                                      name={`shipmentCosts[${index}]`}
                                      instanceId={`shipmentCosts[${index}]`}
                                      placeholder='Choose Shipment Preset'
                                      value={formik.values.shipmentCosts[index] || ''}
                                      getOptionLabel={e => e.label}
                                      getOptionValue={e => e.value}
                                      onChange={(data) => formik.setFieldValue(`shipmentCosts[${index}]`, data)}
                                      defaultOptions
                                      loadOptions={(inputValue) => FetchShipmentCosts({
                                        token: authContext.token,
                                        value: inputValue,
                                        setError,
                                        navigate
                                      })}
                                      isClearable={false}
                                    />
                                    {
                                      formik.getFieldMeta(`shipmentCosts[${index}]`).error
                                        && formik.getFieldMeta(`shipmentCosts[${index}]`).touched
                                        ?
                                        <Form.Text className='text-danger'>
                                          {formik.getFieldMeta(`shipmentCosts[${index}]`).error.maxCost}
                                        </Form.Text>
                                        : null
                                    }
                                  </Form.Group>
                                </Col>
                                <Col sm={12} md={4} lg={2} xl={3} key={`maxCost@${index}`}>
                                  <TextField
                                    value={formik.values.shipmentCosts[index].minCost || ''}
                                    name={`shipmentCosts[${index}].minCost`}
                                    formik={formik}
                                    label='Minimum Cost'
                                    placeholder='Minimum Cost'
                                    hasFieldArrayError={true}
                                    disable={true}
                                  />
                                </Col>
                                <Col sm={12} md={4} lg={2} xl={3} key={`minCost@${index}`}>
                                  <TextField
                                    value={formik.values.shipmentCosts[index].maxCost || ''}
                                    name={`shipmentCosts[${index}].maxCost`}
                                    formik={formik}
                                    label='Maximum Cost'
                                    placeholder='Maximum Cost'
                                    hasFieldArrayError={true}
                                    disable={true}
                                  />
                                </Col>
                                {
                                  isViewMode
                                    ? ''
                                    :
                                    <Col sm={12} md={4} lg={2} xl={2}>
                                      <Form.Group>
                                        <Form.Label className='d-sm-none d-md-block'>&nbsp;</Form.Label>
                                        <Button className='mt-2 text-uppercase d-flex justify-content-center align-items-center pe-3'
                                          variant='danger'
                                          style={{
                                            width: '100%',
                                            textTransform: 'uppercase',
                                          }}
                                          onClick={e => { array.remove(index) }}>
                                          <Delete style={IconStyles} />Remove
                                        </Button>
                                      </Form.Group>
                                    </Col>
                                }
                              </Row>
                            ))
                          }
                        </>
                      )}
                    />
                  </Container>
                  {
                    isViewMode
                      ? ''
                      :
                      <Container style={{
                        background: '#fff',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                      }} className='mt-3'>
                        <Row>
                          <Col sm={12} md={6} lg={4} xl={3}
                            className='d-flex justify-content-end align-items-end gap-3'>
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
                                  ? { width: '50%', height: '2.35rem' }
                                  : { width: '50%' }
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
                          </Col>
                        </Row>
                      </Container>
                  }
                </>
            }

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
                      updatedBy: initialValues.updatedBy.contactName || '',
                      createdBy: initialValues.createdBy.contactName || '',
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

            {
              showUpdateDialogue
                ?
                <CustomAlertDialogue
                  title='Warning'
                  positiveMessage='Update'
                  negativeMessage='Cancel'
                  positiveCallback={() => {
                    SubmitUserData({
                      id: parameters.id,
                      token: authContext.token,
                      navigate,
                      values: formik.values,
                      isEditMode,
                      setIsLoading,
                      setError,
                    })
                    setShowUpdateDialogue(false)
                  }}
                  negativeCallback={() => setShowUpdateDialogue(false)}
                  show={showUpdateDialogue}
                  handleClose={() => setShowUpdateDialogue(false)}>
                  <p>Are you sure you want to update this form?</p>
                  <p>Once updated, you will not be able to revert the changes!</p>
                </CustomAlertDialogue>
                : ''
            }
            <GoBackButton path='/Items' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default TagInfo