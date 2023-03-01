import moment from 'moment'
import { API_SERVICE } from '../../../services'

export const FetchTags = async ({ pageSize, pageIndex, token, setError, setData, navigate }) => {
  const endpoint = `/tag?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      response.data.tags.forEach(tag => {
        tag.status = tag.status.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        tag.updatedAt = moment.utc(tag.updatedAt).local().format('h:mm A, L')
        tag.createdAt = moment.utc(tag.createdAt).local().format('h:mm A, L')
        tag.updatedBy = `${tag.updatedBy.firstName} ${tag.updatedBy.lastName}`
        tag.createdBy = `${tag.createdBy.firstName} ${tag.createdBy.lastName}`
      })
      setData(response.data)
      setError('')
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => {
    if (error.response.status === 401) navigate('/Logout')
    setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`)
  })
}