import { StatusCodes } from 'http-status-codes'
import { AttributeOfItem } from '../models/index.js'
import { UpperCaseFirstLetter } from '../utilities.js'

const AddAttribute = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  try {
    const attribute = await AttributeOfItem.create({
      name: request.body.name,
      status: request.body.status,
      createdBy: request.user._id,
    })
    response.status(StatusCodes.CREATED).json(attribute)
  } catch (error) {
    return next(error)
  }
}

const UpdateAttribute = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Attribute ID is Required!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const options = { _id: request.params.id }
  const attribute = await AttributeOfItem.findOne(options)

  if (!attribute)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Attribute ${request.params.id} Not Found!` })

  attribute.name = request.body.name

  await attribute.save().then(() => {
    response.status(StatusCodes.OK).json(attribute)
  }).catch(error => next(error))
}

const GetAllAttributes = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10

  const attributes = await AttributeOfItem.find().populate('createdBy')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ name: 'asc' })

  const attributeCount = await AttributeOfItem.count()

  const data = []
  attributes.forEach(attribute => {
    data.push({
      _id: attribute._id,
      name: UpperCaseFirstLetter(attribute.name),
      status: attribute.status,
      createdBy: attribute.createdBy.firstName + ' ' + attribute.createdBy.lastName,
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt,
    })
  })

  response.status(StatusCodes.OK).json({
    totalAttributes: attributeCount, page, limit,
    count: data.length || 0, attributes: data
  })
}

const GetAttribute = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Attribute ID is Required!' }

  const attribute = await AttributeOfItem.findOne({ _id: request.params.id }).populate('createdBy')

  response.status(StatusCodes.OK).json({
    _id: attribute._id,
    name: UpperCaseFirstLetter(attribute.name),
    status: attribute.status,
    createdBy: attribute.createdBy.firstName + ' ' + attribute.createdBy.lastName,
    createdAt: attribute.createdAt,
    updatedAt: attribute.updatedAt,
  })
}

export { AddAttribute, UpdateAttribute, GetAllAttributes, GetAttribute }