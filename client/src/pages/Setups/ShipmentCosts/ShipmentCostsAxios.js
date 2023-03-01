import moment from 'moment'
import { API_SERVICE } from '../../../services'

export const FetchShipmentCosts = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `/shipmentCost?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      response.data.shipmentCosts.forEach(shipmentCost => {
        shipmentCost.status = shipmentCost.status.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        shipmentCost.createdAt = moment.utc(shipmentCost.createdAt).local().format('h:mm A, L')
        shipmentCost.updatedAt = moment.utc(shipmentCost.updatedAt).local().format('h:mm A, L')
        shipmentCost.updatedBy = `${shipmentCost.updatedBy.firstName} ${shipmentCost.updatedBy.lastName}`
        shipmentCost.createdBy = `${shipmentCost.createdBy.firstName} ${shipmentCost.createdBy.lastName}`
      })
      setData(response.data)
      setError('')
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}