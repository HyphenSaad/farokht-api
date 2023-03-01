import { StatusCodes } from 'http-status-codes'
import { AttributeOfItem } from '../models/index.js'

const AddAttribute = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const attribute = await AttributeOfItem.create({
    name: request.body.name,
    status: request.body.status,
    createdBy: request.user._id,
    updatedBy: request.user._id,
  }).populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.CREATED).json(attribute)
}

const UpdateAttribute = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Attribute ID is Required!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const options = { _id: request.params.id }
  const attribute = await AttributeOfItem.findOne(options).catch(error => next(error))

  if (!attribute)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Attribute ${request.params.id} Not Found!` })

  attribute.name = request.body.name
  attribute.status = request.body.status
  attribute.updatedBy = request.user._id

  await attribute.populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  await attribute.save().then(() => {
    response.status(StatusCodes.OK).json(attribute)
  }).catch(error => next(error))
}

const GetAllAttributes = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const options = {}
  const data = []

  if (request.query.status)
    options.status = request.query.status

  if (request.query.name)
    options.name = {
      '$regex': `${request.query.name.split(' ').join('|')}`,
      '$options': 'i'
    }

  const attributeCount = await AttributeOfItem.count(options).catch(error => next(error))

  if (minified === 'yes') {
    const attributes = await AttributeOfItem.find(options)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    attributes.forEach(attribute => data.push({
      _id: attribute._id,
      name: attribute.name,
    }))
  } else {
    const attributes = await AttributeOfItem.find(options)
      .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    attributes.forEach(attribute => data.push(attribute))
  }

  response.status(StatusCodes.OK).json({
    totalAttributes: attributeCount, page, limit,
    count: data.length || 0, attributes: data
  })
}

const GetAttribute = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Attribute ID is Required!' }

  const attribute = await AttributeOfItem.findOne({ _id: request.params.id })
    .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.OK).json(attribute)
}

export { AddAttribute, UpdateAttribute, GetAllAttributes, GetAttribute }