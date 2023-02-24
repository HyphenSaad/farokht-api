import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const AuthorizationMiddleware = async (request, response, next) => {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer'))
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid Authorization Token!' }

  const token = authorizationHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: payload.userId })

    if (user.status === 'suspended')
      throw { statusCode: StatusCodes.NOT_FOUND, message: 'You\'r Account is Suspended!' }
    else if (user.status === 'pending')
      throw { statusCode: StatusCodes.BAD_REQUEST, message: 'You\'r Account is Not Approved Yet!' }

    request.user = user
    next()
  } catch (error) {
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid Authorization Token!' }
  }
}

export default AuthorizationMiddleware