import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'

import './Login.css'
import { APP_TITLE } from '../../config'
import { API_SERVICE } from '../../services'

const LoginPage = ({ theme }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Login | ${APP_TITLE}`

    const userData = localStorage.getItem('userData')
    if (userData !== null) {
      return navigate('/', {
        replace: true
      })
    }
  }, [navigate])

  const HandleSubmit = async e => {
    e.preventDefault()

    if (!phoneNumber) {
      setPhoneNumberError('Required')
    } else if (!password) {
      setPasswordError('Required')
    } else if (!phoneNumber.match(/^[0-9]+$/)) {
      setPhoneNumberError('Should Only Contain Digits!')
    } else if (phoneNumber.length < 10) {
      setPhoneNumberError('Invalid Phone Number!')
    }

    const payload = JSON.stringify({
      phoneNumber,
      password,
      role: 'admin',
    })

    setIsLoading(true)

    await API_SERVICE()
      .post(`/auth/login`, payload)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('userData', JSON.stringify(response.data))
          navigate('/', { replace: true })
        }
      }).catch(error => {
        setPhoneNumberError('Invalid Phone Number!')
        setPasswordError('Invalid Password!')
      })

    setIsLoading(false)
  }

  return (
    <div id='login-parent'>
      <div className='login-form'>
        <form onSubmit={HandleSubmit}>
          <h1>Farokht</h1>
          <div className='content'>
            <div className='input-field'>
              <p>Phone Number</p>
              <input
                type='number'
                placeholder='Enter Your Phone Number'
                value={phoneNumber}
                onChange={e => {
                  setPhoneNumberError('')
                  setPhoneNumber(e.target.value)
                }}
              />
              <small style={{ color: 'red' }}>{phoneNumberError}</small>
            </div>
            <div className='input-field'>
              <p>Password</p>
              <input
                type='password'
                placeholder='Enter Your Password'
                value={password}
                onChange={e => {
                  setPasswordError('')
                  setPassword(e.target.value)
                }}
              />
              <small style={{ color: 'red' }}>{passwordError}</small>
            </div>
          </div>
          <button type='submit'>
            {
              isLoading
                ? <BeatLoader color='#fff' size={8} />
                : 'PROCEED'
            }
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage