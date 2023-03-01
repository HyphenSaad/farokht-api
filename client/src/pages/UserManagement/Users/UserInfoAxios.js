import { API_SERVICE } from '../../../services'
import { RoleOptions, StatusOptions } from './UserInfoValues'

export const FetchUserData = async ({ token, id, setFetchError, setIsGettingData, setInitialValues }) => {
  setIsGettingData(true)

  const endpoint = `/user/${id}`

  await API_SERVICE(token).get(endpoint).then(response => {
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
        updatedBy: `${response.data.updatedBy.firstName} ${response.data.updatedBy.lastName}`,
        createdBy: `${response.data.createdBy.firstName} ${response.data.createdBy.lastName}`,
        role: RoleOptions.filter(role => role.value === response.data.role)[0],
        status: StatusOptions.filter(status => status.value === response.data.status)[0],
      })

      setIsGettingData(false)
    } else { setFetchError(`${response.status} - ${response.statusText}`) }
  }).catch(error => setFetchError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
}

export const SubmitUserData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `/user/${id}`
  const addEndpoint = `/user/`

  const _values = { ...values }
  _values.role = values.role.value
  _values.status = values.status.value

  const addRedirect = { state: { message: 'User Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'User Updated Successfully!' }, replace: true, }

  if (isEditMode) {
    await API_SERVICE(token).patch(editEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 200) { navigate('/Users', editRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
  } else {
    await API_SERVICE(token).post(addEndpoint, JSON.stringify(_values)).then(response => {
      if (response.status === 201) { navigate('/Users', addRedirect) }
      else { setError(`${response.status} - ${response.statusText}`) }
    }).catch(error => setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`))
  }

  setIsLoading(false)
}