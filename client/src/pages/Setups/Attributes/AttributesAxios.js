import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchAttributes = async ({
  pageSize,
  pageIndex,
  token,
  setError,
  setData,
  navigate,
}) => {
  const endpoint = `/attribute?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.attributes.forEach(attribute => {
          attribute.status = UpperCaseFirstLetter(attribute.status)
          attribute.updatedAt = FormatTimestamp(attribute.updatedAt)
          attribute.createdAt = FormatTimestamp(attribute.createdAt)
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