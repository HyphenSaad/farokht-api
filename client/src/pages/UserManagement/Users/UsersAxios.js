import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchUsers = async ({
  pageSize,
  pageIndex,
  token,
  setError,
  setData,
  navigate,
}) => {
  const endpoint = `/user?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.users.forEach(user => {
          user.phoneNumber1 = `+92${user.phoneNumber1}`
          user.phoneNumber2 = `+92${user.phoneNumber2}`
          user.status = UpperCaseFirstLetter(user.status)
          user.role = UpperCaseFirstLetter(user.role)
          user.updatedAt = FormatTimestamp(user.updatedAt)
          user.createdAt = FormatTimestamp(user.createdAt)
        })
        setData(response.data)
        setError('')
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const DeleteUser = async ({
  id,
  token,
  navigate,
  setError,
}) => {
  const endpoint = `/user/${id}`

  await API_SERVICE(token)
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Users', {
          state: {
            message: 'User Suspended Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}