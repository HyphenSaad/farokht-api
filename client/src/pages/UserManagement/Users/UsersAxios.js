import axios from 'axios'
import moment from 'moment'
import { API_BASE_URL } from '../../../config'

export const FetchUsers = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `${API_BASE_URL}user?limit=${pageSize}&page=${pageIndex}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    }
  }

  await axios.get(endpoint, headers).then(response => {
    if (response.status === 200) {
      const usersData = response.data
      if (usersData.users.length > 0) {
        usersData.users.forEach(user => {
          user.fullName = `${user.firstName} ${user.lastName}`
          user.phoneNumber1 = `+92${user.phoneNumber1}`
          user.phoneNumber2 = `+92${user.phoneNumber2}`
          user.status = user.status.charAt(0).toUpperCase() + user.status.slice(1)
          user.role = user.role.charAt(0).toUpperCase() + user.role.slice(1)
          user.createdAt = moment.utc(user.createdAt).local().format('h:mm A, L')
          user.updatedAt = moment.utc(user.updatedAt).local().format('h:mm A, L')
        })
        setData(usersData)
      }
      setError('')
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}

export const DeleteUser = async ({ id, token, setError, navigate }) => {
  const endpoint = `${API_BASE_URL}user/${id}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    }
  }

  await axios.delete(endpoint, headers).then(response => {
    if (response.status === 200) {
      navigate('/Users', { state: { message: 'User Suspended Successfully!' }, replace: true })
    }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}