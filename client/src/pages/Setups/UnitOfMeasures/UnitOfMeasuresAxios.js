import { API_SERVICE } from '../../../services'
import moment from 'moment'

export const FetchUnitOfMeasures = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `/uom?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      setError('')
      const data = response.data
      data.unitOfMeasures.forEach(uom => {
        uom.status = uom.status.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        uom.createdAt = moment.utc(uom.createdAt).local().format('h:mm A, L')
        uom.updatedAt = moment.utc(uom.updatedAt).local().format('h:mm A, L')
      })
      setData(data)
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
}