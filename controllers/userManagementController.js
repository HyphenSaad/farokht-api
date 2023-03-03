import { StatusCodes } from 'http-status-codes'
import { Register, Update } from "./authorizationController.js"
import { User } from '../models/index.js'
import { StringValidation } from '../utilities.js'

const CreateUser = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You\'re Unauthorized To Perform This Operation!'
    }
  }

  await Register(request, response, next)
}

const UpdateUser = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You\'re Unauthorized To Perform This Operation!'
    }
  }

  StringValidation({
    fieldName: 'User ID',
    data: request.params.userId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  request.updateUserId = request.params.userId
  await Update(request, response, next)
}

const DeleteUser = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You\'re Unauthorized To Perform This Operation!'
    }
  }

  const userId = request.params.userId

  StringValidation({
    fieldName: 'User ID',
    data: userId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const user = await User.findOne({ _id: userId })
  if (!user) {
    response.status(StatusCodes.NOT_FOUND).json({
      message: `User ${userId} Not Found!`
    })
  }

  if (user._id.toString() === request.user._id.toString()) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `You can't delete your own account!`
    }
  }

  user.status = 'suspended'
  user.updatedBy = request.user._id

  await user.save().then(() => {
    response.status(StatusCodes.OK).json({
      message: `User ${userId} Deleted Successfully!`
    })
  })
}

const GetUser = async (request, response, next) => {
  const userId = request.params.userId

  StringValidation({
    fieldName: 'User ID',
    data: userId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const user = await User.findOne({ _id: userId })
    .populate(populate)

  if (!user) {
    response.status(StatusCodes.NOT_FOUND).json({
      message: `User ${userId} Not Found!`
    })
  }

  response.status(StatusCodes.OK).json(user)
}

const GetAllUsers = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const payload = { '$or': [] }
  const data = []

  const query = { ...request.query }
  Object.keys(query).forEach(key => {
    query[key] = query[key].split(' ').join('|')

    if (key !== 'role' && key !== 'status' && key !== 'limit' && key !== 'page') {
      payload['$or'].push({
        [key]: {
          '$regex': `${query[key]}`,
          '$options': 'i',
        }
      })
    }
  })

  StringValidation({
    fieldName: 'User Role',
    data: query.role,
    validValues: ['admin', 'vendor', 'retailer'],
  })

  StringValidation({
    fieldName: 'User Account Status',
    data: query.status,
    validValues: ['pending', 'approved', 'suspended'],
  })

  if (request.user.role === 'admin') {
    if (query.status)
      payload.status = query.status
    if (query.role)
      payload.role = query.role
  } else {
    payload.role = {
      '$ne': 'admin',
    }
  }

  const totalUsers = await User.count(payload)

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }
  const users = await User.find(payload)
    .populate(minified === 'yes' ? { path: '' } : populate)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ updatedAt: 'desc' })

  console.log(users)
  users.forEach(user => {
    const simpleData = {
      _id: user._id,
      contactName: user.contactName,
    }

    data.push(minified === 'yes' ? simpleData : user)
  })

  response.status(StatusCodes.OK).json({
    totalUsers: totalUsers,
    page: page,
    limie: limit,
    count: data.length || 0,
    users: data,
  })
}

export { CreateUser, UpdateUser, DeleteUser, GetUser, GetAllUsers }