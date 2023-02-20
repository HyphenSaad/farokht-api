import { StatusCodes } from 'http-status-codes'
import { Tag } from '../models/index.js'
import { UpperCaseFirstLetter } from '../utilities.js'

const AddTag = async (request, response, next) => {
  if (!request.body.name)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag Name is Required!' }

  try {
    const tag = await Tag.create({ name: request.body.name, createdBy: request.user._id })
    response.status(StatusCodes.CREATED).json(tag)
  } catch (error) {
    return next(error)
  }
}

const UpdateTag = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag ID is Required!' }

  if (!request.body.name)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag Name is Required!' }

  const options = { _id: request.params.id }
  const tag = await Tag.findOne(options)

  if (!tag)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Tag ${request.params.id} Not Found!` })

  tag.name = request.body.name

  await tag.save().then(() => {
    response.status(StatusCodes.OK).json(tag)
  }).catch(error => next(error))
}

const GetAllTags = async (request, response, next) => {
  const tags = await Tag.find().populate('createdBy')

  const data = []
  tags.forEach(tag => {
    data.push({
      _id: tag._id, name: UpperCaseFirstLetter(tag.name),
      createdBy: tag.createdBy.firstName + ' ' + tag.createdBy.lastName
    })
  })

  response.status(StatusCodes.OK).json(data)
}

const GetTag = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tag ID is Required!' }

  const tag = await Tag.findOne({ _id: request.params.id }).populate('createdBy')

  response.status(StatusCodes.OK).json({
    _id: tag._id, name: UpperCaseFirstLetter(tag.name),
    createdBy: tag.createdBy.firstName + ' ' + tag.createdBy.lastName
  })
}

export { AddTag, UpdateTag, GetAllTags, GetTag }