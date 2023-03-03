import { API_SERVICE } from '../../../services'
import { HandleAxiosError } from '../../../utilities.js'
import { StatusOptions } from './ShipmentCostInfoValues'

export const FetchShipmentCostData = async ({
  id,
  token,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/shipmentCost/${id}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          source: response.data.source || '',
          destination: response.data.destination || '',
          days: response.data.days || '',
          minCost: response.data.minCost || '',
          maxCost: response.data.maxCost || '',
          status: StatusOptions.filter(status => status.value === response.data.status)[0],
          updatedBy: response.data.updatedBy.contactName,
          createdBy: response.data.createdBy.contactName,
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const SubmitShipmentCostData = async ({
  id,
  token,
  navigate,
  values,
  isEditMode,
  setIsLoading,
  setError,
}) => {
  setIsLoading(true)

  const editEndpoint = `/shipmentCost/${id}`
  const addEndpoint = `/shipmentCost/`

  const _values = { ...values }
  _values.status = values.status.value

  const addRedirect = {
    state: {
      message: 'Shipment Cost Created Successfully!',
    },
    replace: true,
  }

  const editRedirect = {
    state: {
      message: 'Shipment Cost Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    await API_SERVICE(token)
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/ShipmentCosts', editRedirect)
        } else {
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  const HandleCreateMode = async () => {
    await API_SERVICE(token)
      .post(addEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 201) {
          navigate('/ShipmentCosts', addRedirect)
        } else {
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  isEditMode ? HandleEditMode() : HandleCreateMode()
}