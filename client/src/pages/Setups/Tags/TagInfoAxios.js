import { API_SERVICE } from '../../../services'
import { StatusOptions } from './TagInfoValues'

export const FetchTagData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `/tag/${id}`

  await API_SERVICE(token).get(endpoint).then(response => {
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

export const SubmitTagData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `/tag/${id}`
  const addEndpoint = `/tag/`

  const _values = { ...values }
  _values.status = values.status.value

  const addRedirect = { state: { message: 'Tag Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Tag Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await API_SERVICE(token).patch(editEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 200) { navigate('/Tags', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  } else {
    await API_SERVICE(token).post(addEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 201) { navigate('/Tags', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  }

  setIsLoading(false)
}