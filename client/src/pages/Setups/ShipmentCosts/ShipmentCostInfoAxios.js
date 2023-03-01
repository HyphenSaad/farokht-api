import { API_SERVICE } from '../../../services'
import { StatusOptions } from './ShipmentCostInfoValues'

export const FetchShipmentCostData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues, navigate }) => {
  setIsGettingData(true)

  const endpoint = `/shipmentCost/${id}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      setFetchError('')
      setInitialValues({
        source: response.data.source || '',
        destination: response.data.destination || '',
        days: response.data.days || '',
        minCost: response.data.minCost || '',
        maxCost: response.data.maxCost || '',
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
        updatedBy: `${response.data.updatedBy.firstName} ${response.data.updatedBy.lastName}`,
        createdBy: `${response.data.createdBy.firstName} ${response.data.createdBy.lastName}`,
      })
      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => {
    if (error.response.status === 401) navigate('/Logout')
    setFetchError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`)
  })
}

export const SubmitShipmentCostData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `/shipmentCost/${id}`
  const addEndpoint = `/shipmentCost/`

  const _values = { ...values }
  _values.status = values.status.value

  const addRedirect = { state: { message: 'Shipment Cost Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Shipment Cost Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await API_SERVICE(token).patch(editEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 200) { navigate('/ShipmentCosts', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => {
      if (error.response.status === 401) navigate('/Logout')
      setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`)
    })
  } else {
    await API_SERVICE(token).post(addEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 201) { navigate('/ShipmentCosts', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => {
      if (error.response.status === 401) navigate('/Logout')
      setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`)
    })
  }

  setIsLoading(false)
}