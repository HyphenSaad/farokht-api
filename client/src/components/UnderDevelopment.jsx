import React from 'react'
import { Container } from 'react-bootstrap'

const UnderDevelopment = ({ title }) => {
  return (
    <Container style={{ padding: '1.25rem' }}>
      <Container style={{
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 1.75,
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '0.5rem'
      }}>
        <h1 style={{ color: 'red' }}>{title}</h1>
        <h2>Under Development</h2>
      </Container>
    </Container>
  )
}

export default UnderDevelopment
