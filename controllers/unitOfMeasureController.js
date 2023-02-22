import { StatusCodes } from 'http-status-codes'
import { UnitOfMeasure } from '../models/index.js'
import { UpperCaseFirstLetter } from '../utilities.js'

const AddUnitOfMeasure = async (request, response, next) => {
  if (!request.body.name)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Unit Of Measure Name is Required!' }

  try {
    const unitOfMeasure = await UnitOfMeasure.create({ name: request.body.name, createdBy: request.user._id })
    response.status(StatusCodes.CREATED).json(unitOfMeasure)
  } catch (error) {
    return next(error)
  }
}

const UpdateUnitOfMeasure = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Unit Of Measure ID is Required!' }

  if (!request.body.name)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Unit Of Measure Name is Required!' }

  const options = { _id: request.params.id }
  const unitOfMeasure = await UnitOfMeasure.findOne(options)

  if (!unitOfMeasure)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Unit Of Measure ${request.params.id} Not Found!` })

  unitOfMeasure.name = request.body.name

  await unitOfMeasure.save().then(() => {
    response.status(StatusCodes.OK).json(unitOfMeasure)
  }).catch(error => next(error))
}

const GetAllUnitOfMeasures = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10

  const unitOfMeasure = await UnitOfMeasure.find().populate('createdBy')
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ name: 'asc' })

  const unitOfMeasureCount = await UnitOfMeasure.count()

  const data = []
  unitOfMeasure.forEach(uom => {
    data.push({
      _id: uom._id, name: UpperCaseFirstLetter(uom.name),
      createdBy: uom.createdBy.firstName + ' ' + uom.createdBy.lastName
    })
  })

  response.status(StatusCodes.OK).json({
    totalUnitOfMeasures: unitOfMeasureCount, page, limit,
    count: data.length || 0, unitOfMeasures: data
  })
}

const GetUnitOfMeasure = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Unit Of Measure ID is Required!' }

  const unitOfMeasure = await UnitOfMeasure.findOne({ _id: request.params.id }).populate('createdBy')

  response.status(StatusCodes.OK).json({
    _id: unitOfMeasure._id, name: UpperCaseFirstLetter(unitOfMeasure.name),
    createdBy: unitOfMeasure.createdBy.firstName + ' ' + unitOfMeasure.createdBy.lastName
  })
}

export { AddUnitOfMeasure, UpdateUnitOfMeasure, GetAllUnitOfMeasures, GetUnitOfMeasure }