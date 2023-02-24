import { StatusCodes } from 'http-status-codes'
import { Tag } from '../models/index.js'
import { UpperCaseFirstLetter } from '../utilities.js'

const AddTag = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  try {
    const tag = await Tag.create({
      name: request.body.name,
      status: request.body.status,
      createdBy: request.user._id,
    })

    response.status(StatusCodes.CREATED).json(tag)
  } catch (error) {
    return next(error)
  }
}

const UpdateTag = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag ID is Required!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const options = { _id: request.params.id }
  const tag = await Tag.findOne(options)

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

  const tags = await Tag.find().populate('createdBy')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ name: 'asc' })

  const tagCount = await Tag.count()

  const data = []
  tags.forEach(tag => {
    data.push({
      _id: tag._id,
      name: UpperCaseFirstLetter(tag.name),
      status: tag.status,
      createdBy: tag.createdBy.firstName + ' ' + tag.createdBy.lastName,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    })
  })

  response.status(StatusCodes.OK).json({
    totalTags: tagCount, page, limit,
    count: data.length || 0, tags: data
  })
}

const GetTag = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag ID is Required!' }

  const tag = await Tag.findOne({ _id: request.params.id }).populate('createdBy')


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