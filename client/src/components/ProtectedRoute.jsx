// I have used useContext to save the user data and JWT token.
// And to make it accessible across the Dashboard
// # Global Context

import React, { useEffect, useState, createContext } from "react"
import { useNavigate } from "react-router-dom"
import jwt_decode from "jwt-decode"

export const AuthContext = createContext()

export const ProtectedRoute = (props) => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const userData = localStorage.getItem('userData')

    if (!userData || userData === 'undefined') {
      setIsLoggedIn(false)
      return navigate('/Login')
    }

    const userDataJSON = JSON.parse(userData)
    const decodedJWT = jwt_decode(userDataJSON.token)

    if (decodedJWT.exp * 1000 < Date.now()) {
      localStorage.clear()
    } else {
      setUserData(userDataJSON)
      setIsLoggedIn(true)
    }
  }, [isLoggedIn, navigate])

  return (
    <AuthContext.Provider value={userData}>
      {isLoggedIn ? props.children : null}
    </AuthContext.Provider>)
}
