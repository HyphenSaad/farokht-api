import { StatusCodes } from 'http-status-codes'
import { UnitOfMeasure } from '../models/index.js'

const AddUnitOfMeasure = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const unitOfMeasure = await UnitOfMeasure.create({
    name: request.body.name,
    status: request.body.status,
    updatedBy: request.user._id,
    createdBy: request.user._id,
  }).populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.CREATED).json(unitOfMeasure)
}

const UpdateUnitOfMeasure = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Unit Of Measure ID is Required!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const options = { _id: request.params.id }
  const unitOfMeasure = await UnitOfMeasure.findOne(options).catch(error => next(error))

  if (!unitOfMeasure)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Unit Of Measure ${request.params.id} Not Found!` })

  unitOfMeasure.name = request.body.name
  unitOfMeasure.status = request.body.status
  unitOfMeasure.updatedBy = request.user._id

  await unitOfMeasure.populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  await unitOfMeasure.save().then(() => {
    response.status(StatusCodes.OK).json(unitOfMeasure)
  }).catch(error => next(error))
}

const GetAllUnitOfMeasures = async (request, response, next) => {
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

  const unitOfMeasureCount = await UnitOfMeasure.count(options).catch(error => next(error))

  if (minified === 'yes') {
    const unitOfMeasure = await UnitOfMeasure.find(options)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    unitOfMeasure.forEach(uom => data.push({
      _id: uom._id,
      name: uom.name,
    }))
  } else {
    const unitOfMeasure = await UnitOfMeasure.find(options)
      .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    unitOfMeasure.forEach(uom => data.push(uom))
  }

  response.status(StatusCodes.OK).json({
    totalUnitOfMeasures: unitOfMeasureCount, page, limit,
    count: data.length || 0, unitOfMeasures: data
  })
}

const GetUnitOfMeasure = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Unit Of Measure ID is Required!' }

  const unitOfMeasure = await UnitOfMeasure.findOne({ _id: request.params.id })
    .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.OK).json(unitOfMeasure)
}

export { AddUnitOfMeasure, UpdateUnitOfMeasure, GetAllUnitOfMeasures, GetUnitOfMeasure }