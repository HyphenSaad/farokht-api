import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const ProtectedRoute = (props) => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('userData')

    if (!userData || userData === 'undefined') {
      setIsLoggedIn(false)
      return navigate('/Login')
    }

    setIsLoggedIn(true)
  }, [isLoggedIn, navigate])

  return (<>{isLoggedIn ? props.children : null}</>)
}
export default ProtectedRoute