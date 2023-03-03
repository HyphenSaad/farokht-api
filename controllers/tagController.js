import { StatusCodes } from 'http-status-codes'
import { Tag } from '../models/index.js'
import { StringValidation } from '../utilities.js'

const __AddTag = async (request) => {
  const { name, status } = request.body

  StringValidation({
    fieldName: 'Tag Name',
    data: name,
    minLength: 1,
    maxLength: 25,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Tag Status',
    data: status,
    isRequired: true,
    validValues: ['disabled', 'enabled'],
  })

  const tagExists = await Tag.findOne({
    name: {
      '$regex': `^${name}$`,
      '$options': 'i'
    },
  })

  if (request.__fromItemPrepare && tagExists) {
    return tagExists
  } else if (tagExists) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Tag already exists!`,
    }
  }

  const payload = {
    name: name,
    status: request.__fromItemPrepare ? 'enabled' : status,
    updatedBy: request.user._id,
    createdBy: request.user._id,
  }

  const tag = await Tag.create(payload)
  return tag
}

const AddTag = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  const tag = await __AddTag(request)
  response.status(StatusCodes.CREATED).json(tag)
}

const UpdateTag = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  StringValidation({
    fieldName: 'Tag ID',
    data: request.params.id,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const { name, status } = request.body

  StringValidation({
    fieldName: 'Tag Name',
    data: name,
    minLength: 1,
    maxLength: 25,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Tag Status',
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

  const tag = await Tag.findOne(payload)
    .populate(populate)

  if (!tag) {
    response.status(StatusCodes.NOT_FOUND).json({
      message: `Tag ${request.params.id} Not Found!`,
    })
  }

  const tagExists = await Tag.findOne({
    name: {
      '$regex': `^${name}$`,
      '$options': 'i'
    },
  })

  if (tagExists && tagExists.name.toLowerCase() !== tag.name.toLowerCase()) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Tag already exists!`,
    }
  }

  tag.name = name
  tag.status = status.toLowerCase()
  tag.updatedBy = request.user._id

  await tag.save().then(() => {
    response.status(StatusCodes.OK).json(tag)
  })
}

const GetAllTags = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const payload = {}
  const data = []

  StringValidation({
    fieldName: 'Tag Status',
    data: request.query.status,
    validValues: ['disabled', 'enabled'],
  })

  StringValidation({
    fieldName: 'Tag Minified Parameter',
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

  // to check the total number of tags we have in database that match the specified criteria
  const totalTags = await Tag.count(payload)

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const tags = await Tag.find(payload)
    .populate(minified === 'yes' ? { path: '' } : populate)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ updatedAt: 'desc' })

  tags.forEach(tag => {
    const simpleData = {
      _id: tag._id,
      name: tag.name,
    }

    data.push(minified === 'yes' ? simpleData : tag)
  })

  response.status(StatusCodes.OK).json({
    totalTags: totalTags,
    page: page,
    limit: limit,
    count: data.length || 0,
    tags: data,
  })
}

const GetTag = async (request, response, next) => {
  StringValidation({
    fieldName: 'Tag ID',
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

  const tag = await Tag.findOne(payload)
    .populate(populate)

  if (!tag) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `Tag ${payload._id} Not Found!`,
    }
  }

  response.status(StatusCodes.OK).json(tag)
}

export { __AddTag, AddTag, UpdateTag, GetAllTags, GetTag }