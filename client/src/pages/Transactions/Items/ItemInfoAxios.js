import axios from 'axios'
import { API_BASE_URL } from '../../../config'
import { StatusOptions } from './ItemInfoValues'

export const FetchUsers = ({ token, value, setError, max = 10 }) => {
  const usersEndpoint = `${API_BASE_URL}user?role=vendor&status=approved&minified=yes&firstName=${value}&lastName=${value}&limit=${max}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`,
    },
  }

  return axios.get(usersEndpoint, headers).then(response => {
    if (response.status === 200) {
      return response.data.users.map(user => {
        return { value: user._id, label: `${user.firstName} ${user.lastName}` }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}

export const FetchTags = ({ token, value, setError, max = 10 }) => {
  const tagsEndpoint = `${API_BASE_URL}tag?minified=yes&name=${value}&limit=${max}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`,
    },
  }

  return axios.get(tagsEndpoint, headers).then(response => {
    if (response.status === 200) {
      return response.data.tags.map(tag => {
        return { value: tag._id, label: tag.name }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}

export const FetchUnitOfMeasures = ({ token, value, setError, max = 10 }) => {
  const unitOfMeasuresEndpoint = `${API_BASE_URL}uom?minified=yes&name=${value}&limit=${max}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`,
    },
  }

  return axios.get(unitOfMeasuresEndpoint, headers).then(response => {
    if (response.status === 200) {
      return response.data.unitOfMeasures.map(uom => {
        return { value: uom._id, label: uom.name }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}

export const FetchAttributes = ({ token, value, setError, max = 10 }) => {
  const attributesEndpoint = `${API_BASE_URL}attribute?minified=yes&name=${value}&limit=${max}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`,
    },
  }

  return axios.get(attributesEndpoint, headers).then(response => {
    if (response.status === 200) {
      return response.data.attributes.map(attribute => {
        return { value: attribute._id, label: attribute.name }
      })
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}

const SubmitShapeAdjustment = (values) => {
  const _values = { ...values }
  _values.status = values.status.value

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

  _values.userId = _values.user.value
  delete _values.user

  return _values
}

export const SubmitUserData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `${API_BASE_URL}item/${id}`
  const addEndpoint = `${API_BASE_URL}item/`

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  const data = new FormData()
  data.append('data', JSON.stringify(SubmitShapeAdjustment(values)))

  const addRedirect = { state: { message: 'Item Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Item Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await axios.patch(editEndpoint, data, headers).then(response => {
      console.log(response.data)
      // if (response.status === 200) { navigate('/Items', editRedirect) }
      // else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => {
      console.log(error)
      setError(`${error.response.status} - ${error.response.statusText}`)
    })
  } else {
    await axios.post(addEndpoint, data, headers).then(response => {
      if (response.status === 201) { navigate('/Items', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => {
      console.log(error.response)
      setError(`${error.response.status} - ${error.response.statusText}`)
    })
  }

  setIsLoading(false)
}

export const FetchItemData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `${API_BASE_URL}item/${id}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  await axios.get(endpoint, headers).then(response => {
    if (response.status === 200) {
      setFetchError('')
      setInitialValues({
        name: response.data.name,
        minOrderNumber: response.data.minOrderNumber,
        description: response.data.description,
        unitOfMeasure: {
          value: response.data.unitOfMeasure._id,
          label: response.data.unitOfMeasure.name.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        },
        tags: response.data.tags.map(tag => {
          return {
            value: tag._id,
            label: tag.name.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
          }
        }),
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
        vendorPayoutPercentage: response.data.vendorPayoutPercentage,
        completionDays: response.data.completionDays,
        user: {
          value: response.data.userId._id,
          label: `${response.data.userId.firstName} ${response.data.userId.lastName}`
        },
        attributes: response.data.attributes.map(attribute => {
          return {
            id: {
              value: attribute._id._id,
              label: attribute._id.name.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' '),
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
            location: `${shipmentCost.location}`,
            cost: `${shipmentCost.cost}`,
            days: `${shipmentCost.days}`
          }
        }),
      })
      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setFetchError(`${error.response.status} - ${error.response.statusText}`))
}