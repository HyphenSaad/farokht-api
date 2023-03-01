import moment from 'moment'
import { API_SERVICE } from '../../../services'

export const FetchUsers = async ({ pageSize, pageIndex, token, setError, setData, navigate }) => {
  const endpoint = `/user?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      response.data.users.forEach(user => {
        user.fullName = `${user.firstName} ${user.lastName}`
        user.phoneNumber1 = `+92${user.phoneNumber1}`
        user.phoneNumber2 = `+92${user.phoneNumber2}`
        user.status = user.status.charAt(0).toUpperCase() + user.status.slice(1)
        user.role = user.role.charAt(0).toUpperCase() + user.role.slice(1)
        user.createdAt = moment.utc(user.createdAt).local().format('h:mm A, L')
        user.updatedAt = moment.utc(user.updatedAt).local().format('h:mm A, L')
        user.updatedBy = `${user.updatedBy.firstName} ${user.updatedBy.lastName}`
        user.createdBy = `${user.createdBy.firstName} ${user.createdBy.lastName}`
      })
      setData(response.data)
      setError('')
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => {
    if (error.response.status === 401) navigate('/Logout')
    setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`)
  })
}

export const DeleteUser = async ({ id, token, setError, navigate }) => {
  const endpoint = `/user/${id}`

  await API_SERVICE(token).delete(endpoint).then(response => {
    if (response.status === 200) {
      navigate('/Users', { state: { message: 'User Suspended Successfully!' }, replace: true })
    }
  }).catch(error => {
    if (error.response.status === 401) navigate('/Logout')
    setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`)
  })
}