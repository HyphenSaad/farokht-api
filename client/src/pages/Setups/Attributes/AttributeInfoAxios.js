import axios from 'axios'
import { API_BASE_URL } from '../../../config'
import { StatusOptions } from './AttributeInfoValues'

export const FetchAttributeData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `${API_BASE_URL}attribute/${id}`
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
        name: response.data.name || '',
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
        createdBy: response.data.createdBy || '',
      })
      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setFetchError(`${error.response.status} - ${error.response.statusText}`))
}

export const SubmitAttributeData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `${API_BASE_URL}attribute/${id}`
  const addEndpoint = `${API_BASE_URL}attribute/`

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  const _values = { ...values }
  _values.status = values.status.value

  const addRedirect = { state: { message: 'Attribute Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Attribute Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await axios.patch(editEndpoint, JSON.stringify(_values), headers).then(response => {
      if (response.status === 200) { navigate('/Attributes', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  } else {
    await axios.post(addEndpoint, JSON.stringify(_values), headers).then(response => {
      if (response.status === 201) { navigate('/Attributes', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  }

  setIsLoading(false)
}