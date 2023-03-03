import { StatusCodes } from 'http-status-codes'
import { UnitOfMeasure } from '../models/index.js'
import { StringValidation } from '../utilities.js'

const __AddUnitOfMeasure = async (request) => {
  const { name, status } = request.body

  StringValidation({
    fieldName: 'Unit of Measure Name',
    data: name,
    minLength: 1,
    maxLength: 25,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Unit of Measure Status',
    data: status,
    isRequired: true,
    validValues: ['disabled', 'enabled'],
  })

  const unitOfMeasureExists = await UnitOfMeasure.findOne({
    name: {
      '$regex': `^${name}$`,
      '$options': 'i'
    },
  })

  if (request.__fromItemPrepare && unitOfMeasureExists) {
    return unitOfMeasureExists
  } else if (unitOfMeasureExists) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Unit of Measure already exists!`,
    }
  }

  const payload = {
    name: name,
    status: request.__fromItemPrepare ? 'enabled' : status,
    updatedBy: request.user._id,
    createdBy: request.user._id,
  }

  const unitOfMeasure = await UnitOfMeasure.create(payload)
  return unitOfMeasure
}

const AddUnitOfMeasure = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  const unitOfMeasure = await __AddUnitOfMeasure(request)
  response.status(StatusCodes.CREATED).json(unitOfMeasure)
}

const UpdateUnitOfMeasure = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  StringValidation({
    fieldName: 'Unit of Measure ID',
    data: request.params.id,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const { name, status } = request.body

  StringValidation({
    fieldName: 'Unit of Measure Name',
    data: name,
    minLength: 1,
    maxLength: 25,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Unit of Measure Status',
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

  const unitOfMeasure = await UnitOfMeasure.findOne(payload)
    .populate(populate)

  if (!unitOfMeasure) {
    response.status(StatusCodes.NOT_FOUND).json({
      message: `Unit of Measure ${request.params.id} Not Found!`,
    })
  }

  const unitOfMeasureExists = await UnitOfMeasure.findOne({
    name: {
      '$regex': `^${name}$`,
      '$options': 'i'
    },
  })

  if (unitOfMeasureExists && unitOfMeasureExists.name.toLowerCase() !== unitOfMeasure.name.toLowerCase()) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Unit of Measure already exists!`,
    }
  }

  unitOfMeasure.name = name
  unitOfMeasure.status = status.toLowerCase()
  unitOfMeasure.updatedBy = request.user._id

  await unitOfMeasure.save().then(() => {
    response.status(StatusCodes.OK).json(unitOfMeasure)
  })
}

const GetAllUnitOfMeasures = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const payload = {}
  const data = []

  StringValidation({
    fieldName: 'Unit of Measure Status',
    data: request.query.status,
    validValues: ['disabled', 'enabled'],
  })

  StringValidation({
    fieldName: 'Unit of Measure Minified Parameter',
    data: minified,
    validValues: ['yes', 'no'],
  })

  if (request.query.status) {
    payload.status = request.query.status
  }

  if (request.query.name) {
    payload.name = {
      '$regex': `${request.query.name.split(' ').join('|')}`,
      '$options': 'i'
    }
  }

  // to check the total number of unitOfMeasures we have in database that match the specified criteria
  const totalUnitOfMeasures = await UnitOfMeasure.count(payload)

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const unitOfMeasures = await UnitOfMeasure.find(payload)
    .populate(minified === 'yes' ? { path: '' } : populate)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ updatedAt: 'desc' })

  unitOfMeasures.forEach(unitOfMeasure => {
    const simpleData = {
      _id: unitOfMeasure._id,
      name: unitOfMeasure.name,
    }

    data.push(minified === 'yes' ? simpleData : unitOfMeasure)
  })

  response.status(StatusCodes.OK).json({
    totalUnitOfMeasures: totalUnitOfMeasures,
    page: page,
    limit: limit,
    count: data.length || 0,
    unitOfMeasures: data,
  })
}

const GetUnitOfMeasure = async (request, response, next) => {
  StringValidation({
    fieldName: 'Unit of Measure ID',
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

  const unitOfMeasure = await UnitOfMeasure.findOne(payload)
    .populate(populate)

  response.status(StatusCodes.OK).json(unitOfMeasure)
}

export { __AddUnitOfMeasure, AddUnitOfMeasure, UpdateUnitOfMeasure, GetAllUnitOfMeasures, GetUnitOfMeasure }