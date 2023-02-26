import moment from 'moment'
import { API_SERVICE } from '../../../services'

export const FetchAttributes = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `/attribute?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      setError('')
      const data = response.data
      data.attributes.forEach(attribute => {
        attribute.status = attribute.status.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        attribute.createdAt = moment.utc(attribute.createdAt).local().format('h:mm A, L')
        attribute.updatedAt = moment.utc(attribute.updatedAt).local().format('h:mm A, L')
      })
      setData(data)
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}