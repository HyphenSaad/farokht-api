import axios from 'axios'
import moment from 'moment'
import { API_BASE_URL } from '../../../config'

export const FetchAttributes = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `${API_BASE_URL}attribute?limit=${pageSize}&page=${pageIndex}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    }
  }

  await axios.get(endpoint, headers).then(response => {
    if (response.status === 200) {
      setError('')
      const data = response.data
      data.attributes.forEach(attribute => {
        attribute.status = attribute.status.charAt(0).toUpperCase() + attribute.status.slice(1)
        attribute.createdAt = moment.utc(attribute.createdAt).local().format('h:mm A, L')
        attribute.updatedAt = moment.utc(attribute.updatedAt).local().format('h:mm A, L')
      })
      setData(data)
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}