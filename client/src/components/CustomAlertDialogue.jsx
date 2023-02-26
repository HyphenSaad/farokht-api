import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Cancel, Done } from '@mui/icons-material'

const CustomAlertDialogue = ({
  title,
  positiveMessage, positiveCallback,
  negativeMessage, negativeCallback,
  handleClose, show,
  children
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button className='text-uppercase d-flex justify-content-center align-items-center pe-3'
          onClick={negativeCallback}
          variant='danger'>
          <Cancel style={{ marginRight: '0.25rem', fontSize: '1.25rem' }} />{negativeMessage}
        </Button>
        <Button className='text-uppercase d-flex justify-content-center align-items-center pe-3'
          onClick={positiveCallback}
          variant='success'>
          <Done style={{ marginRight: '0.25rem', fontSize: '1.25rem' }} />{positiveMessage}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CustomAlertDialogue