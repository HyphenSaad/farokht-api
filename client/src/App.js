import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './styles/App.css'

import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

import {
  Login, Dashboard, PageNotFound,
  Payments, EmailNotification, Users, UserInfo, DownloadbleData,
  UnitOfMeasures, Tags, Attributes, Items, Orders
} from './pages/index'

const App = () => {
  return (
    <Routes>
      <Route path='/Login' element={<Login />} />

      <Route path='/' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        {/* TRANSACTIONS */}
        <Route path='Orders' element={<Orders />} />
        <Route path='Items' element={<Items />} />
        {/* SETUPS */}
        <Route path='UnitOfMeasures' element={<UnitOfMeasures />} />
        <Route path='Attributes' element={<Attributes />} />
        <Route path='Tags' element={<Tags />} />
        {/* REPORTS */}
        <Route path='DownloadbleData' element={<DownloadbleData />} />
        {/* USER MANAGEMENT */}
        <Route path='Users' element={<Users />} />
        <Route path='UserInfo' element={<UserInfo />} />
        <Route path='UserInfo/:id' element={<UserInfo />} />
        <Route path='EmailNotification' element={<EmailNotification />} />
        {/* PAYMENT MANAGEMENT */}
        <Route path='Payments' element={<Payments />} />
      </Route>

      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}

export default App
