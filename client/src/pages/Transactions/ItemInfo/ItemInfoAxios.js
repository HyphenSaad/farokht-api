import axios from 'axios'
import { API_BASE_URL } from '../../../config'

export const FetchItemData = async ({ token, setUserData, setTagData, setUnitOfMeasureData, setAttributeData, setErrorMessage }) => {
  const usersEndpoint = `${API_BASE_URL}user?role=vendor&status=approved`
  const tagsEndpoint = `${API_BASE_URL}tag/`
  const unitOfMeasuresEndpoint = `${API_BASE_URL}uom/`
  const attributesEndpoint = `${API_BASE_URL}attribute/`

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  // GET USERS (VENDORS)
  await axios.get(usersEndpoint, headers).then(response => {
    if (response.status === 200) {
      const userData = response.data.users.map(user => {
        return { value: user._id, label: `${user.firstName} ${user.lastName}` }
      })
      setUserData(userData)
    } else { setErrorMessage(`${response.status} - ${response.statusText}`) }
  }).catch(error => setErrorMessage(`${error.response.status} - ${error.response.statusText}`))

  // GET TAGS
  await axios.get(tagsEndpoint, headers).then(response => {
    if (response.status === 200) {
      const tagData = response.data.tags.map(tag => {
        return { value: tag._id, label: tag.name }
      })
      setTagData(tagData)
    } else { setErrorMessage(`${response.status} - ${response.statusText}`) }
  }).catch(error => setErrorMessage(`${error.response.status} - ${error.response.statusText}`))

  // GET UNIT OF MEASURE
  await axios.get(unitOfMeasuresEndpoint, headers).then(response => {
    if (response.status === 200) {
      const unitOfMeasureData = response.data.unitOfMeasures.map(unitOfMeasure => {
        return { value: unitOfMeasure._id, label: unitOfMeasure.name }
      })
      setUnitOfMeasureData(unitOfMeasureData)
    } else { setErrorMessage(`${response.status} - ${response.statusText}`) }
  }).catch(error => setErrorMessage(`${error.response.status} - ${error.response.statusText}`))

  // GET ATTRIBUTES
  await axios.get(attributesEndpoint, headers).then(response => {
    if (response.status === 200) {
      const attributeData = response.data.attributes.map(attribute => {
        return { value: attribute._id, label: attribute.name, used: false }
      })
      setAttributeData(attributeData)
    } else { setErrorMessage(`${response.status} - ${response.statusText}`) }
  }).catch(error => setErrorMessage(`${error.response.status} - ${error.response.statusText}`))
}

export const SubmitUserData = async ({ values, isEditMode, token, id, navigate, setIsLoading, setError }) => {
  setIsLoading(true)

  const editEndpoint = `${API_BASE_URL}item/${id}`
  const addEndpoint = `${API_BASE_URL}item/`

  const headers = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Authorization': `Bearer ${token}`
    },
  }

  const _values = { ...values }
  _values.status = values.status.value

  console.log(_values)

  const addRedirect = { state: { message: 'Item Created Successfully!' }, replace: true, }
  const editRedirect = { state: { message: 'Item Updated Successfully!' }, replace: true, }

  await axios.post(addEndpoint, JSON.stringify(_values), headers).then(response => {
    if (response.status === 201) { navigate('/Users', addRedirect) }
    else { setError(`${response.status} - ${response.statusText}`) }
  }).catch(error => {
    console.log('Saadin', error)
    setError(`${error.response.status} - ${error.response.statusText}`)
  })

  // if (isEditMode) {
  //   await axios.patch(editEndpoint, JSON.stringify(_values), headers).then(response => {
  //     if (response.status === 200) { navigate('/Users', editRedirect) }
  //     else { setError(`${response.status} - ${response.statusText}`) }
  //   }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  // } else {
  //   await axios.post(addEndpoint, JSON.stringify(_values), headers).then(response => {
  //     if (response.status === 201) { navigate('/Users', addRedirect) }
  //     else { setError(`${response.status} - ${response.statusText}`) }
  //   }).catch(error => setError(`${error.response.status} - ${error.response.statusText}`))
  // }

  setIsLoading(false)
}