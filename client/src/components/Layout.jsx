import React, { useState } from 'react'
import {
  Dashboard,
  AddBusinessRounded, ViewListRounded,
  StraightenOutlined, AppRegistrationRounded, SellRounded, LocalShipping,
  CloudDownloadRounded,
  PeopleRounded, MarkEmailReadRounded,
  PaidRounded,
  Menu as MenuIcon, Logout
} from '@mui/icons-material'
import { Sidebar, Menu, MenuItem, menuClasses, sidebarClasses, useProSidebar } from 'react-pro-sidebar'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { CustomAlertDialogue } from './index.js'

const CustomMenuItem = ({ path, title, icon }) => {
  return (
    <MenuItem
      id={window.location.pathname === path ? '' : 'rps-menu-item'}
      active={window.location.pathname === path}
      component={<Link to={path} />}
      icon={icon}
    >{title}</MenuItem>
  )
}

const SidebarHead = () => {
  const titleStyles = {
    textAlign: 'center', textTransform: 'uppercase',
    margin: 0, fontSize: '2rem'
  }

  const userStyles = {
    textAlign: 'center', textTransform: 'uppercase',
    margin: 0, fontSize: '1.15rem', letterSpacing: 1.5
  }

  return (
    <div style={{ padding: '2.75rem', backgroundColor: '#273142' }}>
      <p style={titleStyles}>Farokht</p>
      <p style={userStyles}>Admin Panel</p>
    </div>
  )
}

const SideBarSeparator = ({ title }) => {
  return (
    <p style={{
      margin: 0, padding: '0.25rem 1.25rem', textTransform: 'uppercase',
      fontSize: '0.8rem', letterSpacing: 2.5, background: '#4d4d4d',
      color: '#cfcfcf', lineHeight: '1.25rem'
    }}>{title}</p>
  )
}

const GetTitle = () => {
  switch (window.location.pathname) {
    case '/': return { path: '/', title: 'Dashboard' }
    case '/Orders': return { path: '/Orders', title: 'Orders' }
    case '/Items': return { path: '/Items', title: 'Items' }
    case '/Attributes': return { path: '/Attributes', title: 'Attributes' }
    // case '/ShipmentCosts': return { path: '/ShipmentCosts', title: 'Shipment Costs' }
    case '/Tags': return { path: '/Tags', title: 'Tags' }
    case '/UnitOfMeasures': return { path: '/UnitOfMeasures', title: 'Unit Of Measures' }
    case '/DownloadbleData': return { path: '/DownloadbleData', title: 'Reports' }
    case '/Users': return { path: '/Users', title: 'Users' }
    case '/EmailNotification': return { path: '/Payments', title: 'Email Notification' }
    case '/Payments': return { path: '/Payments', title: 'Payments' }
    default: { }
  }

  if (window.location.pathname.includes('/UserInfo'))
    return { path: window.location.pathname, title: 'User Info' }
  else if (window.location.pathname.includes('/ItemInfo'))
    return { path: window.location.pathname, title: 'Item Info' }
  else if (window.location.pathname.includes('/AttributeInfo'))
    return { path: window.location.pathname, title: 'Attribute Info' }
  // else if (window.location.pathname.includes('/ShipmentCostInfo'))
  //   return { path: window.location.pathname, title: 'Shipment Cost Info' }
  else if (window.location.pathname.includes('/TagInfo'))
    return { path: window.location.pathname, title: 'Tag Info' }
  else if (window.location.pathname.includes('/UnitOfMeasureInfo'))
    return { path: window.location.pathname, title: 'Unit of Measure Info' }
  return { path: window.location.pathname, title: 'Error' }
}

const Layout = () => {
  const SideBarRootStyles = {
    ['.' + sidebarClasses.container]: {
      backgroundColor: '#1f1f1f',
      color: '#fff',
      height: '100%'
    }
  }

  const MenuRootStyles = {
    ['.' + menuClasses.active]: {
      backgroundColor: '#363636',
      color: '#fff',
      '&:hover': { backgroundColor: '#363636', }
    },
    ['.' + menuClasses.button]: {
      height: 42,
    },
    ['.' + menuClasses.icon + ' *']: {
      height: 20,
    },
  }

  const { toggleSidebar } = useProSidebar()
  const navigate = useNavigate()

  const [showClearDialogue, setShowClearDialogue] = useState(false)

  return (
    <div className='row m-0' style={{ height: '100vh' }}>
      <div className='col-auto m-0 p-0'>
        <Sidebar rootStyles={SideBarRootStyles} breakPoint="md">
          <SidebarHead />
          <Menu rootStyles={MenuRootStyles}>
            <CustomMenuItem title='Dashboard' path='/' icon={<Dashboard />} />
            <SideBarSeparator title='Transactions' />
            <CustomMenuItem title='Orders' path='/Orders' icon={<AddBusinessRounded />} />
            <CustomMenuItem title='Items' path='/Items' icon={<ViewListRounded />} />
            <SideBarSeparator title='Setups' />
            <CustomMenuItem title='Attributes' path='/Attributes' icon={<AppRegistrationRounded />} />
            {/* <CustomMenuItem title='Shipment Costs' path='/ShipmentCosts' icon={<LocalShipping />} /> */}
            <CustomMenuItem title='Tags' path='/Tags' icon={<SellRounded />} />
            <CustomMenuItem title='Unit of Measures' path='/UnitOfMeasures' icon={<StraightenOutlined />} />
            <SideBarSeparator title='Reports' />
            <CustomMenuItem title='Downloadable Data' path='/DownloadbleData' icon={<CloudDownloadRounded />} />
            <SideBarSeparator title='User Management' />
            <CustomMenuItem title='Users' path='/Users' icon={<PeopleRounded />} />
            <CustomMenuItem title='Email Notification' path='/EmailNotification' icon={<MarkEmailReadRounded />} />
            <SideBarSeparator title='Payment Management' />
            <CustomMenuItem title='Payments' path='/Payments' icon={<PaidRounded />} />
          </Menu>
        </Sidebar>
      </div>
      <div
        className='col m-0 p-0 pb-5'
        style={{
          width: '50%',
        }}>
        <div style={{
          display: 'flex',
          backgroundColor: '#fff',
          padding: '0.5rem 1rem',
        }}>
          <button
            id='menu-toggle-button'
            onClick={() => toggleSidebar()}>
            <MenuIcon />
          </button>
          <p
            style={{
              margin: 0,
              textTransform: 'uppercase',
              display: 'inline-block',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => navigate(GetTitle().path)}>
            {GetTitle().title}
          </p>
          <button
            style={{ marginLeft: 'auto', }}
            id='logout-button'
            onClick={() => setShowClearDialogue(true)}>
            <Logout />
          </button>
        </div>
        {
          showClearDialogue
            ?
            <CustomAlertDialogue
              title='Warning'
              positiveMessage='Yes'
              negativeMessage='No'
              positiveCallback={() => {
                localStorage.clear()
                navigate('/Login', {
                  replace: true,
                })
                setShowClearDialogue(false)
              }}
              negativeCallback={() => setShowClearDialogue(false)}
              show={showClearDialogue}
              handleClose={() => setShowClearDialogue(false)}>
              <p>Are you sure you want to logout?</p>
            </CustomAlertDialogue>
            : ''
        }
        <Outlet />
      </div>
    </div>
  )
}

export default Layout