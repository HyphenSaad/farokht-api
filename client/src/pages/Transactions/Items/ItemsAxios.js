import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchItems = async ({
  pageSize,
  pageIndex,
  token,
  setError,
  setData,
  navigate,
}) => {
  const endpoint = `/item?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.items.forEach(item => {
          item.uom = item.unitOfMeasure.name
          item.status = UpperCaseFirstLetter(item.status)
          item.updatedAt = FormatTimestamp(item.updatedAt)
          item.createdAt = FormatTimestamp(item.createdAt)
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

export const DeleteItem = async ({
  id,
  token,
  setError,
  navigate,
}) => {
  const endpoint = `/item/${id}`

  await API_SERVICE(token)
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Items', {
          state: {
            message: 'Item Deleted Successfully!',
          },
          replace: true,
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}