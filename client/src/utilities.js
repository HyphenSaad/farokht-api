import moment from 'moment'

export const UpperCaseFirstLetter = (data) => {
  return data.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join(' ')
}

export const HandleAxiosError = ({
  error,
  setError,
  navigate,
}) => {
  if (error.code === 'ERR_NETWORK') {
    setError(`${error.code}`)
  } else if (error.response.status === 401) {
    navigate('/Login')
  } else if (Array.isArray(error.response.data.message)) {
    setError(error.response.data.message.map(error => {
      return `${error.response.status} - ${error || error.response.statusText}`
    }))
  } else {
    setError(`${error.response.status} - ${error.response.data.message || error.response.statusText}`)
  }
}

export const FormatTimestamp = (timestamp) => {
  return moment.utc(timestamp).local().format('h:mm A, L')
}