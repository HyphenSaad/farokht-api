import { StatusCodes } from 'http-status-codes'
import { AttributeOfItem } from '../models/index.js'
import { StringValidation } from '../utilities.js'

const __AddAttribute = async (request) => {
  const { name, status } = request.body

  StringValidation({
    fieldName: 'Attribute Name',
    data: name,
    minLength: 2,
    maxLength: 25,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Attribute Status',
    data: status,
    isRequired: true,
    validValues: ['disabled', 'enabled'],
  })

  const attributeExists = await AttributeOfItem.findOne({
    name: {
      '$regex': `^${name}$`,
      '$options': 'i'
    },
  })

  if (request.__fromItemPrepare && attributeExists) {
    return attributeExists
  } else if (attributeExists) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Attribute already exists!`,
    }
  }

  const payload = {
    name: name,
    status: request.__fromItemPrepare ? 'enabled' : status,
    updatedBy: request.user._id,
    createdBy: request.user._id,
  }

  const attribute = await AttributeOfItem.create(payload)
  return attribute
}

const AddAttribute = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  const attribute = await __AddAttribute(request)
  response.status(StatusCodes.CREATED).json(attribute)
}

const UpdateAttribute = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  StringValidation({
    fieldName: 'Attribute ID',
    data: request.params.id,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const { name, status } = request.body

  StringValidation({
    fieldName: 'Attribute Name',
    data: name,
    minLength: 2,
    maxLength: 25,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Attribute Status',
    data: status,
    isRequired: true,
    validValues: ['disabled', 'enabled'],
  })

  const payload = { _id: request.params.id, }

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const attribute = await AttributeOfItem.findOne(payload)
    .populate(populate)

  if (!attribute) {
    response.status(StatusCodes.NOT_FOUND).json({
      message: `Attribute ${request.params.id} Not Found!`,
    })
  }

  const attributeExists = await AttributeOfItem.findOne({
    name: {
      '$regex': `^${name}$`,
      '$options': 'i'
    },
  })

  if (attributeExists && attributeExists.name.toLowerCase() !== attribute.name.toLowerCase()) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Attribute already exists!`,
    }
  }

  attribute.name = name
  attribute.status = status.toLowerCase()
  attribute.updatedBy = request.user._id

  await attribute.save().then(() => {
    response.status(StatusCodes.OK).json(attribute)
  })
}

const GetAllAttributes = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const payload = {}
  const data = []

  StringValidation({
    fieldName: 'Attribute Status',
    data: request.query.status,
    validValues: ['disabled', 'enabled'],
  })

  StringValidation({
    fieldName: 'Attribute Minified Parameter',
    data: minified,
    validValues: ['yes', 'no'],
  })

  if (request.query.status && request.user.role === 'admin') {
    payload.status = request.query.status
  } else {
    payload.status = 'enabled'
  }

  if (request.query.name) {
    payload.name = {
      '$regex': `${request.query.name.split(' ').join('|')}`,
      '$options': 'i'
    }
  }

  // to check the total number of attributes we have in database that match the specified criteria
  const totalAttributes = await AttributeOfItem.count(payload)

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const attributes = await AttributeOfItem.find(payload)
    .populate(minified === 'yes' ? { path: '' } : populate)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ updatedAt: 'desc' })

  attributes.forEach(attribute => {
    const simpleData = {
      _id: attribute._id,
      name: attribute.name,
    }

    data.push(minified === 'yes' ? simpleData : attribute)
  })

  response.status(StatusCodes.OK).json({
    totalAttributes: totalAttributes,
    page: page,
    limit: limit,
    count: data.length || 0,
    attributes: data,
  })
}

const GetAttribute = async (request, response, next) => {
  StringValidation({
    fieldName: 'Attribute ID',
    data: request.params.id,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const payload = { _id: request.params.id, }

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const attribute = await AttributeOfItem.findOne(payload)
    .populate(populate)

  if (!attribute) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `Attribute ${payload._id} Not Found!`,
    }
  }

  response.status(StatusCodes.OK).json(attribute)
}

export { __AddAttribute, AddAttribute, UpdateAttribute, GetAllAttributes, GetAttribute }