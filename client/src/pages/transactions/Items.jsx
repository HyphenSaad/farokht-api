import React from 'react'
import { Container, Form } from 'react-bootstrap'
import Select from 'react-select'
import TextField from '../../components/TextField'
import UnderDevelopment from '../../components/UnderDevelopment'

const Items = () => {
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  // return (<UnderDevelopment title='Items' />)
  return (
    <Container style={{ padding: '1.25rem' }} >
      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} >
        <Select options={options} />
        <Form.Group className="mb-3">
          <Form.Label>abc</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
      </Container>
    </Container>
  )
}

export default Items
