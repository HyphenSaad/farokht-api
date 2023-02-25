import { StatusCodes } from 'http-status-codes'
import { UnitOfMeasure } from '../models/index.js'
import { UpperCaseFirstLetter } from '../utilities.js'

const AddUnitOfMeasure = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.body.name || !request.body.status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const unitOfMeasure = await UnitOfMeasure.create({
    name: request.body.name,
    status: request.body.status,
    createdBy: request.user._id,
  }).catch(error => next(error))

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

  await unitOfMeasure.save().then(() => {
    response.status(StatusCodes.OK).json(unitOfMeasure)
  }).catch(error => next(error))
}

const GetAllUnitOfMeasures = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const options = {}

  if (request.query.status) options.status = request.query.status
  if (request.query.name) options.name = { '$regex': `${request.query.name.split(' ').join('|')}`, '$options': 'i' }

  const unitOfMeasure = await UnitOfMeasure.find(options)
    .populate('createdBy')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: 'desc' })
    .catch(error => next(error))

  const unitOfMeasureCount = await UnitOfMeasure.count(options).catch(error => next(error))

  const data = []
  if (minified === 'no') {
    unitOfMeasure.forEach(uom => data.push({
      _id: uom._id,
      name: UpperCaseFirstLetter(uom.name),
      status: uom.status,
      createdBy: uom.createdBy.firstName + ' ' + uom.createdBy.lastName,
      createdAt: uom.createdAt,
      updatedAt: uom.updatedAt,
    }))
  } else {
    unitOfMeasure.forEach(uom => data.push({
      _id: uom._id,
      name: UpperCaseFirstLetter(uom.name),
    }))
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
    .populate('createdBy')
    .catch(error => next(error))

  response.status(StatusCodes.OK).json({
    _id: unitOfMeasure._id,
    name: UpperCaseFirstLetter(unitOfMeasure.name),
    status: unitOfMeasure.status,
    createdBy: unitOfMeasure.createdBy.firstName + ' ' + unitOfMeasure.createdBy.lastName,
    createdAt: unitOfMeasure.createdAt,
    updatedAt: unitOfMeasure.updatedAt,
  })
}

export { AddUnitOfMeasure, UpdateUnitOfMeasure, GetAllUnitOfMeasures, GetUnitOfMeasure }