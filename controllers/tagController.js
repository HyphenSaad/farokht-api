import { StatusCodes } from 'http-status-codes'
import { Tag } from '../models/index.js'
import { UpperCaseFirstLetter } from '../utilities.js'

const AddTag = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const tag = await Tag.create({
    name: request.body.name,
    status: request.body.status,
    createdBy: request.user._id,
  }).catch(error => next(error))

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

  await tag.save().then(() => {
    response.status(StatusCodes.OK).json(tag)
  }).catch(error => next(error))
}

const GetAllTags = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const options = {}

  if (request.query.status) options.status = request.query.status
  if (request.query.name) options.name = { '$regex': `${request.query.name.split(' ').join('|')}`, '$options': 'i' }

  const tags = await Tag.find(options)
    .populate('createdBy')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: 'asc' })
    .catch(error => next(error))

  const tagCount = await Tag.count(options).catch(error => next(error))

  const data = []
  if (minified === 'no') {
    tags.forEach(tag => data.push({
      _id: tag._id,
      name: UpperCaseFirstLetter(tag.name),
      status: tag.status,
      createdBy: tag.createdBy.firstName + ' ' + tag.createdBy.lastName,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    }))
  } else {
    tags.forEach(tag => data.push({
      _id: tag._id,
      name: UpperCaseFirstLetter(tag.name),
    }))
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
    .populate('createdBy')
    .catch(error => next(error))

  response.status(StatusCodes.OK).json({
    _id: tag._id,
    name: UpperCaseFirstLetter(tag.name),
    status: tag.status,
    createdBy: tag.createdBy.firstName + ' ' + tag.createdBy.lastName,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  })
}

export { AddTag, UpdateTag, GetAllTags, GetTag }