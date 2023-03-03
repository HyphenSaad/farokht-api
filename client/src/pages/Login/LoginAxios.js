import { API_SERVICE } from '../../services'
import { HandleAxiosError } from '../../../utilities.js'

export const SubmitLogin = async ({
  setIsLoading,
  setError,
  navigate,
  phoneNumber,
  password
}) => {
  setIsLoading(true)

  const payload = JSON.stringify({
    phoneNumber,
    password,
    role: 'admin',
  })

  await API_SERVICE()
    .post(`/auth/login`, payload)
    .then((response) => {
      if (response.status === 200) {
        localStorage.setItem('userData', JSON.stringify(response.data))
        navigate('/', {
          replace: true,
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsLoading(false)
}