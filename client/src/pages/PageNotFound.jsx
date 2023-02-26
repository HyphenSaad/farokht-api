import React from 'react'
import { Container } from 'react-bootstrap'

const PageNotFound = () => {
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
        <h1 style={{ color: 'red' }}>404</h1>
        <h2>Page Not Found</h2>
      </Container>
    </Container>
  )
}

export default PageNotFound
