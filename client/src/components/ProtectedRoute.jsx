import React, { useEffect, useState, createContext } from "react"
import { useNavigate } from "react-router-dom"

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

    setUserData(JSON.parse(userData))
    setIsLoggedIn(true)
  }, [isLoggedIn, navigate])

  return (
    <AuthContext.Provider value={userData}>
      {isLoggedIn ? props.children : null}
    </AuthContext.Provider>)
}
