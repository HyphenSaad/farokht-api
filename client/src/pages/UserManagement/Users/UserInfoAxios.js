import { API_SERVICE } from '../../../services'
import { RoleOptions, StatusOptions } from './UserInfoValues'
import { HandleAxiosError } from '../../../utilities.js'
import PAKISTANI_CITIES from '../../../cities'

export const FetchUserData = async ({
  id,
  token,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/user/${id}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          contactName: response.data.contactName || '',
          password: response.data.password || '',
          phoneNumber1: response.data.phoneNumber1 || '',
          phoneNumber2: response.data.phoneNumber2 || '',
          landline: response.data.landline || '',
          address: response.data.address || '',
          email: response.data.email || '',
          companyName: response.data.companyName || '',
          paymentMethod: response.data.paymentMethod || '',
          bankName: response.data.bankName || '',
          bankBranchCode: response.data.bankBranchCode || '',
          bankAccountNumber: response.data.bankAccountNumber || '',
          updatedBy: response.data.updatedBy?.contactName || '',
          createdBy: response.data.createdBy?.contactName || '',
          role: RoleOptions.filter(role => role.value === response.data.role)[0],
          status: StatusOptions.filter(status => status.value === response.data.status)[0],
          location: PAKISTANI_CITIES.filter(city => city.value === response.data.location)[0],
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const SubmitUserData = async ({
  id,
  token,
  navigate,
  values,
  isEditMode,
  setIsLoading,
  setError,
}) => {
  setIsLoading(true)

  const editEndpoint = `/user/${id}`
  const addEndpoint = `/user/`

  const _values = { ...values }
  _values.role = values.role.value
  _values.status = values.status.value
  _values.location = values.location.value

  const addRedirect = {
    state: {
      message: 'User Created Successfully!',
    },
    replace: true,
  }

  const editRedirect = {
    state: {
      message: 'User Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    await API_SERVICE(token)
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Users', editRedirect)
        } else {
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  const HandleCreateMode = async () => {
    await API_SERVICE(token)
      .post(addEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 201) {
          navigate('/Users', addRedirect)
        } else {
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  isEditMode ? HandleEditMode() : HandleCreateMode()
}