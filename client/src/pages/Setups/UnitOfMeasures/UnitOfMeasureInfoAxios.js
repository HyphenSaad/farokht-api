import { API_SERVICE } from '../../../services'
import { StatusOptions } from './UnitOfMeasureInfoValues'

export const FetchUnitOfMeasureData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `/uom/${id}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      setFetchError('')
      setInitialValues({
        name: response.data.name || '',
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
        updatedBy: `${response.data.updatedBy.firstName} ${response.data.updatedBy.lastName}`,
        createdBy: `${response.data.createdBy.firstName} ${response.data.createdBy.lastName}`,
      })
      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setFetchError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

export const SubmitUnitOfMeasureData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `/uom/${id}`
  const addEndpoint = `/uom/`

  const _values = { ...values }
  _values.status = values.status.value

  const addRedirect = { state: { message: 'Unit Of Measure Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Unit Of Measure Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await API_SERVICE(token).patch(editEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 200) { navigate('/UnitOfMeasures', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  } else {
    await API_SERVICE(token).post(addEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 201) { navigate('/UnitOfMeasures', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  }

  setIsLoading(false)
}