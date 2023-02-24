import { StatusCodes } from 'http-status-codes'
import { Register, Update } from "./authorizationController.js"
import { User } from '../models/index.js'

const CreateUser = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  await Register(request, response, next)
}

const UpdateUser = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  const userId = request.params.userId
  if (!userId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  request.updateUserId = userId
  await Update(request, response, next)
}

const DeleteUser = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  const userId = request.params.userId
  if (!userId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  const user = await User.findOne({ _id: userId })
  if (!user)
    response.status(StatusCodes.NOT_FOUND).json({ message: `User ${userId} Not Found!` })

  user.status = 'suspended'

  await user.save().then(() => {
    response.status(StatusCodes.OK).json({ message: `User ${userId} Deleted Successfully!` })
  }).catch(error => next(error))
}

const GetUser = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  const userId = request.params.userId
  if (!userId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  const user = await User.findOne({ _id: userId })
  if (!user)
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'User Not Found!' }

  user.password = undefined
  response.status(StatusCodes.OK).json(user)
}

const GetAllUsers = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const options = {}

  if (request.query.status) options.status = request.query.status
  if (request.query.firstName) options.firstName = { '$regex': `${request.query.firstName}`, '$options': 'i' }
  if (request.query.lastName) options.lastName = { '$regex': `${request.query.lastName}`, '$options': 'i' }
  if (request.query.phoneNumber1) options.phoneNumber1 = { '$regex': `${request.query.phoneNumber1}`, '$options': 'i' }
  if (request.query.phoneNumber2) options.phoneNumber2 = { '$regex': `${request.query.phoneNumber2}`, '$options': 'i' }
  if (request.query.companyName) options.companyName = { '$regex': `${request.query.companyName}`, '$options': 'i' }
  if (request.query.location) options.location = { '$regex': `${request.query.location}`, '$options': 'i' }
  if (request.query.address) options.address = { '$regex': `${request.query.address}`, '$options': 'i' }
  if (request.query.paymentMethod) options.paymentMethod = { '$regex': `${request.query.paymentMethod}`, '$options': 'i' }
  if (request.query.bankName) options.bankName = { '$regex': `${request.query.bankName}`, '$options': 'i' }
  if (request.query.branchCode) options.branchCode = { '$regex': `${request.query.branchCode}`, '$options': 'i' }
  if (request.query.bankAccountNumber) options.bankAccountNumber = { '$regex': `${request.query.bankAccountNumber}`, '$options': 'i' }

  options.role = request.query.role && request.query.role !== 'admin'
    ? { '$regex': `${request.query.role}`, '$options': 'i' }
    : options.role = { '$ne': 'admin' }

  const userCount = await User.count(options)

  const users = await User.find(options)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ status: 'asc' })

  if (minified === 'yes') {
    response.status(StatusCodes.OK).json({
      totalUsers: userCount, page, limit,
      count: users.length || 0,
      users: users.filter(user => {
        return {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      })
    })
  } else {
    response.status(StatusCodes.OK).json({
      totalUsers: userCount, page, limit,
      count: users.length || 0, users
    })
  }
}

export { CreateUser, UpdateUser, DeleteUser, GetUser, GetAllUsers }