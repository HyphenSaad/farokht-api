import { API_SERVICE } from '../../../services'
import moment from 'moment'

export const FetchItems = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `/item?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    console.log(response.data)
    if (response.status === 200) {
      response.data.items.forEach(item => {
        item.fullName = `${item.vendorId.firstName} ${item.vendorId.lastName}`
        item.uom = item.unitOfMeasure.name
        item.status = item.status.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        item.updatedAt = moment.utc(item.updatedAt).local().format('h:mm A, L')
        item.createdAt = moment.utc(item.createdAt).local().format('h:mm A, L')
        item.updatedBy = `${item.updatedBy.firstName} ${item.updatedBy.lastName}`
        item.createdBy = `${item.createdBy.firstName} ${item.createdBy.lastName}`
      })
      setError('')
      setData(response.data)
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

export const DeleteItem = async ({ id, token, setError, navigate }) => {
  const endpoint = `/item/${id}`

  await API_SERVICE(token).delete(endpoint).then(response => {
    if (response.status === 200) {
      navigate('/Items', { state: { message: 'Item Deleted Successfully!' }, replace: true })
    }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}