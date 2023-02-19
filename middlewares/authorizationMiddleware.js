import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const TokenAuthorization = (request, response, next) => {
  const authorizationHeader = request.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer'))
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid Authorization Token!' }

  const token = authorizationHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    request.user = { userId: payload.userId }
    next()
  } catch (error) {
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'Invalid Authorization Token!' }
  }
}

const AdminAuthorization = async (request, response, next) => {
  const user = await User.findOne({ _id: request.user.userId })

  if (user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You Are Not Authorized To Access This Resource!' }

  if (user.status === 'suspended')
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'You\'r Account is Suspended!' }
  else if (user.status === 'pending')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'You\'r Account is Not Approved Yet!' }

  request.user = user

  next()
}

const VendorAuthorization = async (request, response, next) => {
  const user = await User.findOne({ _id: request.user.userId })

  if (user.role !== 'vendor')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You Are Not Authorized To Access This Resource!' }

  if (user.status === 'suspended')
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'You\'r Account is Suspended!' }
  else if (user.status === 'pending')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'You\'r Account is Not Approved Yet!' }

  request.user = user
  next()
}

const RetailerAuthorization = async (request, response, next) => {
  const user = await User.findOne({ _id: request.user.userId })

  if (user.role !== 'retailer')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You Are Not Authorized To Access This Resource!' }

  if (user.status === 'suspended')
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'You\'r Account is Suspended!' }
  else if (user.status === 'pending')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'You\'r Account is Not Approved Yet!' }

  request.user = user
  next()
}

export { TokenAuthorization, AdminAuthorization, VendorAuthorization, RetailerAuthorization }