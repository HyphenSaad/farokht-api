import axios from 'axios'
import moment from 'moment'
import { API_BASE_URL } from '../../../config'

export const FetchTags = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `${API_BASE_URL}tag?limit=${pageSize}&page=${pageIndex}`
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
      data.tags.forEach(tag => {
        tag.status = tag.status.charAt(0).toUpperCase() + tag.status.slice(1)
        tag.createdAt = moment.utc(tag.createdAt).local().format('h:mm A, L')
        tag.updatedAt = moment.utc(tag.updatedAt).local().format('h:mm A, L')
      })
      setData(data)
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}