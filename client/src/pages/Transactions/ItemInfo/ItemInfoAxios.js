import axios from 'axios'
import { API_BASE_URL } from '../../../config'

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

const ShapeAdjustment = (values) => {
  const _values = { ...values }
  _values.status = values.status.value

  _values.tags = _values.tags.map(tag => {
    return { id: tag.hasOwnProperty('__isNew__') ? '' : tag.value, value: tag.label }
  })

  _values.unitOfMeasure = {
    id: _values.unitOfMeasure.hasOwnProperty('__isNew__') ? '' : _values.unitOfMeasure.value,
    value: _values.unitOfMeasure.label
  }

  _values.attributes = _values.attributes.map(attribute => {
    if (attribute.id.hasOwnProperty('__isNew__')) {
      return { name: attribute.id.label, value: attribute.value }
    } else {
      return { id: attribute.id.value, value: attribute.value }
    }
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

  const _values = ShapeAdjustment(values)
  console.log('data', _values)

  const data = new FormData()
  data.append('data', JSON.stringify(_values))

  const addRedirect = { state: { message: 'Item Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Item Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await axios.patch(editEndpoint, JSON.stringify(_values), headers).then(response => {
      if (response.status === 200) { navigate('/Items', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  } else {
    await axios.post(addEndpoint, data, headers).then(response => {
      if (response.status === 201) {
        console.log(response.data)
      }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => {
      if (error.response.data.message) setError(`${error.response.status} - ${JSON.stringify(error.response.data.message)}`)
      else setError(`${error.response.status} - ${error.response.statusText}`)
    })
  }

  setIsLoading(false)
}