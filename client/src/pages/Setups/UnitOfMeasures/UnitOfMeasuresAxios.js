import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchUnitOfMeasures = async ({
  pageSize,
  pageIndex,
  token,
  setError,
  setData,
  navigate,
}) => {
  const endpoint = `/uom?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.unitOfMeasures.forEach(unitOfMeasure => {
          unitOfMeasure.status = UpperCaseFirstLetter(unitOfMeasure.status)
          unitOfMeasure.updatedAt = FormatTimestamp(unitOfMeasure.updatedAt)
          unitOfMeasure.createdAt = FormatTimestamp(unitOfMeasure.createdAt)
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