import axios from 'axios'
import { API_BASE_URL } from '../../../config'
import { RoleOptions, StatusOptions } from './UserInfoValues'

export const FetchUserData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `${API_BASE_URL}user/${id}`
  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  await axios.get(endpoint, headers).then(response => {
    if (response.status === 200) {
      setFetchError('')

      setInitialValues({
        firstName: response.data.firstName || '',
        lastName: response.data.lastName || '',
        password: response.data.password || '',
        phoneNumber1: response.data.phoneNumber1 || '',
        phoneNumber2: response.data.phoneNumber2 || '',
        landline: response.data.landline || '',
        location: response.data.location || '',
        address: response.data.address || '',
        email: response.data.email || '',
        companyName: response.data.companyName || '',
        paymentMethod: response.data.paymentMethod || '',
        bankName: response.data.bankName || '',
        bankBranchCode: response.data.bankBranchCode || '',
        bankAccountNumber: response.data.bankAccountNumber || '',
        role: RoleOptions.filter(role => role.value === response.data.role)[0],
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
      })

      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setFetchError(`${error.response.status} - ${error.response.statusText}`))
}

export const SubmitUserData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `${API_BASE_URL}user/${id}`
  const addEndpoint = `${API_BASE_URL}user/`

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  const _values = { ...values }
  _values.role = values.role.value
  _values.status = values.status.value

  const addRedirect = { state: { message: 'User Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'User Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await axios.patch(editEndpoint, JSON.stringify(_values), headers).then(response => {
      if (response.status === 200) { navigate('/Users', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  } else {
    await axios.post(addEndpoint, JSON.stringify(_values), headers).then(response => {
      if (response.status === 201) { navigate('/Users', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  }

  setIsLoading(false)
}