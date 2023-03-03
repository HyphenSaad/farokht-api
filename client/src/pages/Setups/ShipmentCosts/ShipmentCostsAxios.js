import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchShipmentCosts = async ({
  pageSize,
  pageIndex,
  token,
  setError,
  setData,
  navigate,
}) => {
  const endpoint = `/shipmentCost?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.shipmentCosts.forEach(shipmentCost => {
          shipmentCost.status = UpperCaseFirstLetter(shipmentCost.status)
          shipmentCost.updatedAt = FormatTimestamp(shipmentCost.updatedAt)
          shipmentCost.createdAt = FormatTimestamp(shipmentCost.createdAt)
        })
        setData(response.data)
        setError('')
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}