import axios from 'axios'
import { API_BASE_URL } from '../../../config'

export const FetchUnitOfMeasureData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `${API_BASE_URL}uom/${id}`
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
        createdBy: response.data.createdBy || '',
      })
      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setFetchError(`${error.response.status} - ${error.response.statusText}`))
}

export const SubmitUnitOfMeasureData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `${API_BASE_URL}uom/${id}`
  const addEndpoint = `${API_BASE_URL}uom/`

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  const addRedirect = { state: { message: 'Unit Of Measure Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Unit Of Measure Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await axios.patch(editEndpoint, JSON.stringify(values), headers).then(response => {
      if (response.status === 200) { navigate('/UnitOfMeasures', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  } else {
    await axios.post(addEndpoint, JSON.stringify(values), headers).then(response => {
      if (response.status === 201) { navigate('/UnitOfMeasures', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  }

  setIsLoading(false)
}