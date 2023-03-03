import { API_SERVICE } from '../../../services'
import { StatusOptions } from './AttributeInfoValues'
import { HandleAxiosError } from '../../../utilities.js'

export const FetchAttributeData = async ({
  id,
  token,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/attribute/${id}`

  await API_SERVICE(token)
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          name: response.data.name || '',
          status: StatusOptions.filter(status => status.value === response.data.status)[0],
          updatedBy: response.data.updatedBy.contactName,
          createdBy: response.data.createdBy.contactName,
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const SubmitAttributeData = async ({
  id,
  token,
  navigate,
  values,
  isEditMode,
  setIsLoading,
  setError,
}) => {
  setIsLoading(true)

  const editEndpoint = `/attribute/${id}`
  const addEndpoint = `/attribute/`

  const _values = { ...values }
  _values.status = values.status.value

  const addRedirect = {
    state: {
      message: 'Attribute Created Successfully!',
    },
    replace: true,
  }

  const editRedirect = {
    state: {
      message: 'Attribute Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    await API_SERVICE(token)
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Attributes', editRedirect)
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
          navigate('/Attributes', addRedirect)
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