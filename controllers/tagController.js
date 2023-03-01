import { StatusCodes } from 'http-status-codes'
import { Tag } from '../models/index.js'

const AddTag = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const tag = await Tag.create({
    name: request.body.name,
    status: request.body.status,
    updatedBy: request.user._id,
    createdBy: request.user._id,
  }).populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.CREATED).json(tag)
}

const UpdateTag = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag ID is Required!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const options = { _id: request.params.id }
  const tag = await Tag.findOne(options).catch(error => next(error))

  if (!tag)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Tag ${request.params.id} Not Found!` })

  tag.name = request.body.name
  tag.status = request.body.status
  tag.updatedBy = request.user._id

  await tag.populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  await tag.save().then(() => {
    response.status(StatusCodes.OK).json(tag)
  }).catch(error => next(error))
}

const GetAllTags = async (request, response, next) => {
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

  const tagCount = await Tag.count(options).catch(error => next(error))

  if (minified === 'yes') {
    const tags = await Tag.find(options)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    tags.forEach(tag => data.push({
      _id: tag._id,
      name: tag.name,
    }))
  } else {
    const tags = await Tag.find(options)
      .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    tags.forEach(tag => data.push(tag))
  }

  response.status(StatusCodes.OK).json({
    totalTags: tagCount, page, limit,
    count: data.length || 0, tags: data
  })
}

const GetTag = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag ID is Required!' }

  const tag = await Tag.findOne({ _id: request.params.id })
    .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.OK).json(tag)
}

export { AddTag, UpdateTag, GetAllTags, GetTag }