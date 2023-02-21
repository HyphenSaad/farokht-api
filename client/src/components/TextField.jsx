import React from 'react'
import { Form } from 'react-bootstrap'

const TextField = ({ label, placeholder, name, formik, disable = false }) => {
  return (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type="text" placeholder={placeholder} name={name}
        onChange={formik.handleChange} value={formik.values[name]} disabled={disable} />
      {formik.errors[name] && formik.touched[name]
        ? <Form.Text className='text-danger'>{formik.errors[name]}</Form.Text> : null}
    </Form.Group>
  )
}

export default TextField