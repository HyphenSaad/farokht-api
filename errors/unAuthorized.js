import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './CustomAPIError.js'

class UnAuthorizedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default UnAuthorizedError