import { ArrowBackIosNew } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const GoBackButton = ({ path }) => {
  const navigate = useNavigate()
  return (
    <Button variant='secondary' className='mt-3 float-end text-uppercase d-flex justify-content-center align-items-center'
      onClick={() => navigate(path)}>
      <ArrowBackIosNew style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Go Back
    </Button>
  )
}

export default GoBackButton