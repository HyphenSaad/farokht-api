import moment from 'moment'
import { API_SERVICE } from '../../../services'

export const FetchTags = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `/tag?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      setError('')
      const data = response.data
      data.tags.forEach(tag => {
        tag.status = tag.status.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        tag.createdAt = moment.utc(tag.createdAt).local().format('h:mm A, L')
        tag.updatedAt = moment.utc(tag.updatedAt).local().format('h:mm A, L')
      })
      setData(data)
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}