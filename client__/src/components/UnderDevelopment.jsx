import React from 'react'

function UnderDevelopment({ title }) {
  return (
    <div style={{
      textAlign: 'center', background: '#fff', margin: '2rem',
      padding: '1rem', borderRadius: '0.5rem', textTransform: 'uppercase',
      letterSpacing: 2
    }}>
      <h1 style={{ color: 'red' }}>{title}</h1>
      <h2>Under Development</h2>
    </div>
  )
}

export default UnderDevelopment
