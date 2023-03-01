import { API_SERVICE } from '../../../services'
import { StatusOptions } from './ItemInfoValues'

export const FetchUsers = ({ token, value, setError, max = 10 }) => {
  const usersEndpoint = `/user?role=vendor&status=approved&minified=yes&firstName=${value}&lastName=${value}&limit=${max}`

  return API_SERVICE(token).get(usersEndpoint).then(response => {
    if (response.status === 200) {
      return response.data.users.map(user => {
        return { value: user._id, label: `${user.firstName} ${user.lastName}` }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

export const FetchTags = ({ token, value, setError, max = 10 }) => {
  const tagsEndpoint = `/tag?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token).get(tagsEndpoint).then(response => {
    if (response.status === 200) {
      return response.data.tags.map(tag => {
        return { value: tag._id, label: tag.name }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

export const FetchUnitOfMeasures = ({ token, value, setError, max = 10 }) => {
  const unitOfMeasuresEndpoint = `/uom?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token).get(unitOfMeasuresEndpoint).then(response => {
    if (response.status === 200) {
      return response.data.unitOfMeasures.map(uom => {
        return { value: uom._id, label: uom.name }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

export const FetchAttributes = ({ token, value, setError, max = 10 }) => {
  const attributesEndpoint = `/attribute?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token).get(attributesEndpoint).then(response => {
    if (response.status === 200) {
      return response.data.attributes.map(attribute => {
        return { value: attribute._id, label: attribute.name }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

export const FetchShipmentCosts = ({ token, value, setError, max = 10 }) => {
  const unitOfMeasuresEndpoint = `/shipmentCost?minified=yes&name=${value}&limit=${max}&status=enabled`

  return API_SERVICE(token).get(unitOfMeasuresEndpoint).then(response => {
    if (response.status === 200) {
      return response.data.shipmentCosts.map(shipmentCost => {
        return {
          value: shipmentCost._id,
          label: `${shipmentCost.days} days, ${shipmentCost.source} to ${shipmentCost.destination}`,
          minCost: shipmentCost.minCost,
          maxCost: shipmentCost.maxCost,
        }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

const SubmitShapeAdjustment = (values) => {
  const _values = { ...values }
  _values.status = values.status.value.length < 1 ? undefined : values.status.value

  _values.tags = _values.tags.map(tag => {
    return tag.hasOwnProperty('__isNew__')
      ? { id: '', name: tag.label }
      : { id: tag.value, name: tag.label }
  })

  _values.unitOfMeasure = _values.unitOfMeasure.hasOwnProperty('__isNew__')
    ? { id: '', name: _values.unitOfMeasure.label }
    : { id: _values.unitOfMeasure.value, name: _values.unitOfMeasure.label }

  _values.attributes = _values.attributes.map(attribute => {
    return attribute.id.hasOwnProperty('__isNew__')
      ? { id: '', name: attribute.id.label, value: attribute.value }
      : { id: attribute.id.value, name: attribute.id.label, value: attribute.value }
  })

  _values.shipmentCosts = _values.shipmentCosts.map(shipmentCost => {
    return shipmentCost.value
  })

  _values.vendorId = _values.user.value
  delete _values.user

  console.log(_values)
  return _values
}

export const SubmitUserData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `/item/${id}`
  const addEndpoint = `/item/`

  const data = new FormData()
  data.append('data', JSON.stringify(SubmitShapeAdjustment(values)))

  const addRedirect = { state: { message: 'Item Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Item Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await API_SERVICE(token).patch(editEndpoint, data).then(response => {
      if (response.status === 200) { navigate('/Items', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
  } else {
    await API_SERVICE(token).post(addEndpoint, data).then(response => {
      if (response.status === 201) { navigate('/Items', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
  }

  setIsLoading(false)
}

export const FetchItemData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `/item/${id}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      setFetchError('')
      setInitialValues({
        name: response.data.name,
        minOrderNumber: response.data.minOrderNumber,
        maxOrderNumber: response.data.maxOrderNumber === 0 ? '' : response.data.maxOrderNumber,
        description: response.data.description,
        unitOfMeasure: {
          value: response.data.unitOfMeasure._id,
          label: response.data.unitOfMeasure.name
        },
        tags: response.data.tags.map(tag => {
          return {
            value: tag._id,
            label: tag.name
          }
        }),
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
        vendorPayoutPercentage: response.data.vendorPayoutPercentage,
        completionDays: response.data.completionDays,
        user: {
          value: response.data.vendorId._id,
          label: `${response.data.vendorId.firstName} ${response.data.vendorId.lastName}`
        },
        attributes: response.data.attributes.map(attribute => {
          return {
            id: {
              value: attribute._id._id,
              label: attribute._id.name,
            },
            value: `${attribute.value}`
          }
        }),
        priceSlabs: response.data.priceSlabs.map(priceSlab => {
          return {
            slab: `${priceSlab.slab}`,
            price: `${priceSlab.price}`,
          }
        }),
        shipmentCosts: response.data.shipmentCosts.map(shipmentCost => {
          return {
            value: `${shipmentCost._id}`,
            label: `${shipmentCost.days} days, ${shipmentCost.source} to ${shipmentCost.destination}`,
            maxCost: `${shipmentCost.maxCost}`,
            minCost: `${shipmentCost.minCost}`
          }
        }),
        updatedBy: `${response.data.updatedBy.firstName} ${response.data.updatedBy.lastName}`,
        createdBy: `${response.data.createdBy.firstName} ${response.data.createdBy.lastName}`,
      })
      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setFetchError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}