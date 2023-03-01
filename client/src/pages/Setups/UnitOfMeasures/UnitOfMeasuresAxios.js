import { API_SERVICE } from '../../../services'
import moment from 'moment'

export const FetchUnitOfMeasures = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `/uom?limit=${pageSize}&page=${pageIndex}`

  await API_SERVICE(token).get(endpoint).then(response => {
    if (response.status === 200) {
      response.data.unitOfMeasures.forEach(uom => {
        uom.status = uom.status.split(' ').map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
        uom.createdAt = moment.utc(uom.createdAt).local().format('h:mm A, L')
        uom.updatedAt = moment.utc(uom.updatedAt).local().format('h:mm A, L')
        uom.updatedBy = `${uom.updatedBy.firstName} ${uom.updatedBy.lastName}`
        uom.createdBy = `${uom.createdBy.firstName} ${uom.createdBy.lastName}`
      })
      setData(response.data)
      setError('')
    } else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}