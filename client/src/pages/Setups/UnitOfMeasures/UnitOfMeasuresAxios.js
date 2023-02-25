import axios from 'axios'
import moment from 'moment'
import { API_BASE_URL } from '../../../config'

export const FetchUnitOfMeasures = async ({ pageSize, pageIndex, token, setError, setData }) => {
  const endpoint = `${API_BASE_URL}uom?limit=${pageSize}&page=${pageIndex}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    }
  }

  await axios.get(endpoint, headers).then(response => {
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