import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { ProtectedRoute, Layout } from './components'

import {
  Login, Dashboard, PageNotFound,
  Payments, EmailNotification, Users, UserInfo, DownloadbleData,
  UnitOfMeasures, UnitOfMeasureInfo, Attributes, AttributeInfo, Tags, TagInfo,
  Items, ItemInfo, Orders
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
        <Route path='ItemInfo' element={<ItemInfo />} />
        <Route path='ItemInfo/:id' element={<ItemInfo />} />
        {/* SETUPS */}
        <Route path='UnitOfMeasures' element={<UnitOfMeasures />} />
        <Route path='UnitOfMeasureInfo' element={<UnitOfMeasureInfo />} />
        <Route path='UnitOfMeasureInfo/:id' element={<UnitOfMeasureInfo />} />
        <Route path='Attributes' element={<Attributes />} />
        <Route path='AttributeInfo' element={<AttributeInfo />} />
        <Route path='AttributeInfo/:id' element={<AttributeInfo />} />
        <Route path='Tags' element={<Tags />} />
        <Route path='TagInfo' element={<TagInfo />} />
        <Route path='TagInfo/:id' element={<TagInfo />} />
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
