import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchTags = async ({
  pageSize,
  pageIndex,
  token,
  setError,
  setData,
  navigate,
}) => {
  const endpoint = `/tag?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.tags.forEach(tag => {
          tag.status = UpperCaseFirstLetter(tag.status)
          tag.updatedAt = FormatTimestamp(tag.updatedAt)
          tag.createdAt = FormatTimestamp(tag.createdAt)
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