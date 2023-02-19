import { StatusCodes } from 'http-status-codes'
import { UnitOfMeasure } from '../models/index.js'

const AddUnitOfMeasure = async (request, response, next) => {
  if (!request.body.name)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Unit Of Measure Name is Required!' }

  try {
    const unitOfMeasure = await UnitOfMeasure.create({ name: request.body.name })
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
  const unitOfMeasure = await UnitOfMeasure.find()
  response.status(StatusCodes.OK).json(unitOfMeasure)
}

export { AddUnitOfMeasure, UpdateUnitOfMeasure, GetAllUnitOfMeasures }