import { API_SERVICE } from '../../../services'
import moment from 'moment'

export const FetchItems = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `/item?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      const itemsData = response.data
      if (itemsData.items.length > 0) {
        itemsData.items.forEach(item => {
          item.fullName = `${item.userId.firstName} ${item.userId.lastName}`
          item.uom = item.unitOfMeasure.name
          item.status = item.status.charAt(0).toUpperCase() + item.status.slice(1)
          item.createdAt = moment.utc(item.createdAt).local().format('h:mm A, L')
          item.updatedAt = moment.utc(item.updatedAt).local().format('h:mm A, L')
        })
        setData(itemsData)
      }
      setError('')
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}

export const DeleteItem = async ({ id, token, setError, navigate }) => {
  const endpoint = `/item/${id}`

  await API_SERVICE(token).delete(endpoint).then(response => {
    if (response.status === 200) {
      navigate('/Items', { state: { message: 'Item Suspended Successfully!' }, replace: true })
    }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}