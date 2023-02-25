import axios from 'axios'
import moment from 'moment'
import { API_BASE_URL } from '../../../config'

export const FetchItems = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `${API_BASE_URL}item?limit=${pageSize}&page=${pageIndex}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    }
  }

  await axios.get(endpoint, headers).then(response => {
    if (response.status === 200) {
      const itemsData = response.data
      if (itemsData.items.length > 0) {
        itemsData.items.forEach(user => {
          // user.fullName = `${user.firstName} ${user.lastName}`
          user.status = user.status.charAt(0).toUpperCase() + user.status.slice(1)
          user.createdAt = moment.utc(user.createdAt).local().format('h:mm A, L')
          user.updatedAt = moment.utc(user.updatedAt).local().format('h:mm A, L')
        })
        setData(itemsData)
        console.log(itemsData)
      }
      setError('')
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}

export const DeleteItem = async ({ id, token, setError, navigate }) => {
  const endpoint = `${API_BASE_URL}item/${id}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    }
  }

  await axios.delete(endpoint, headers).then(response => {
    if (response.status === 200) {
      navigate('/Items', { state: { message: 'Item Suspended Successfully!' }, replace: true })
    }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}