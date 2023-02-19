import React from 'react'
import {
  Dashboard,
  AddBusinessRounded, ViewListRounded,
  StraightenOutlined, AppRegistrationRounded, SellRounded,
  CloudDownloadRounded,
  PeopleRounded, MarkEmailReadRounded,
  PaidRounded,
  Menu as MenuIcon, Logout
} from '@mui/icons-material'
import { Sidebar, Menu, MenuItem, menuClasses, sidebarClasses, useProSidebar } from 'react-pro-sidebar'
import { Link, useNavigate, Outlet } from 'react-router-dom'

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
      margin: 0, padding: '0.5rem 1.25rem', textTransform: 'uppercase',
      fontSize: '0.8rem', letterSpacing: 2.5, background: '#4d4d4d',
      color: '#cfcfcf'
    }}>{title}</p>
  )
}

const GetTitle = () => {
  switch (window.location.pathname) {
    case '/': return { path: '/', title: 'Dashboard' }
    case '/Orders': return { path: '/Orders', title: 'Orders' }
    case '/Items': return { path: '/Items', title: 'Items' }
    case '/UnitOfMeasures': return { path: '/UnitOfMeasures', title: 'Unit Of Measures' }
    case '/Attributes': return { path: '/Attributes', title: 'Attributes' }
    case '/Tags': return { path: '/Tags', title: 'Tags' }
    case '/DownloadbleData': return { path: '/DownloadbleData', title: 'Reports' }
    case '/Users': return { path: '/Users', title: 'Users' }
    case '/AddUser': return { path: '/Users', title: 'Users' }
    case '/EmailNotification': return { path: '/Payments', title: 'Email Notification' }
    case '/Payments': return { path: '/Payments', title: 'Payments' }
    default: return 'Error'
  }
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
  }

  const { toggleSidebar } = useProSidebar()
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', height: '100%', }}>
      <Sidebar rootStyles={SideBarRootStyles} breakPoint="md">
        <SidebarHead />
        <Menu rootStyles={MenuRootStyles}>
          <CustomMenuItem title='Dashboard' path='/' icon={<Dashboard />} />
          <SideBarSeparator title='Transactions' />
          <CustomMenuItem title='Orders' path='/Orders' icon={<AddBusinessRounded />} />
          <CustomMenuItem title='Items' path='/Items' icon={<ViewListRounded />} />
          <SideBarSeparator title='Setups' />
          <CustomMenuItem title='Unit of Measures' path='/UnitOfMeasures' icon={<StraightenOutlined />} />
          <CustomMenuItem title='Attributes' path='/Attributes' icon={<AppRegistrationRounded />} />
          <CustomMenuItem title='Tags' path='/Tags' icon={<SellRounded />} />
          <SideBarSeparator title='Reports' />
          <CustomMenuItem title='Downloadable Data' path='/DownloadbleData' icon={<CloudDownloadRounded />} />
          <SideBarSeparator title='User Management' />
          <CustomMenuItem title='Users' path='/Users' icon={<PeopleRounded />} />
          <CustomMenuItem title='Email Notification' path='/EmailNotification' icon={<MarkEmailReadRounded />} />
          <SideBarSeparator title='Payment Management' />
          <CustomMenuItem title='Payments' path='/Payments' icon={<PaidRounded />} />
        </Menu>
      </Sidebar>
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', backgroundColor: '#fff', padding: '1rem', }}>
          <button id='menu-toggle-button' onClick={() => toggleSidebar()}>
            <MenuIcon />
          </button>
          <p style={{
            margin: 0, textTransform: 'uppercase', display: 'inline-block',
            fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer'
          }}
            onClick={() => { navigate(GetTitle().path) }}
          >{GetTitle().title}</p>
          <button style={{ marginLeft: 'auto' }} id='logout-button' onClick={() => {
            localStorage.clear()
            navigate('/Login', { replace: true })
          }}>
            <Logout />
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  )
}

export default Layout