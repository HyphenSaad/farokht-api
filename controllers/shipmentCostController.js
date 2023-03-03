import { StatusCodes } from 'http-status-codes'
import { ShipmentCost } from '../models/index.js'
import { NumberValidation, StringValidation } from '../utilities.js'

const AddShipmentCost = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  const { source, destination, days, maxCost, minCost, status } = request.body

  StringValidation({
    fieldName: 'Shipment Cost Source',
    data: source,
    minLength: 2,
    maxLength: 40,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Shipment Cost Destination',
    data: destination,
    minLength: 2,
    maxLength: 40,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Shipment Days',
    data: days,
    minValue: 1,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Shipment Minimum Cost',
    data: minCost,
    minValue: 0,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Shipment Maximum Cost',
    data: maxCost,
    minValue: 0,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Shipment Cost Status',
    data: status,
    isRequired: true,
    validValues: ['disabled', 'enabled'],
  })

  if (minCost > maxCost) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Minimum Cost Should Be Less Than Or Equal To Maximum Cost!'
    }
  }

  const payload = {
    source: source,
    destination: destination,
    days: days,
    maxCost: maxCost,
    minCost: minCost,
    status: status,
    updatedBy: request.user._id,
    createdBy: request.user._id,
  }

  const shipmentCost = await ShipmentCost.create(payload)
  response.status(StatusCodes.CREATED).json(shipmentCost)
}

const UpdateShipmentCost = async (request, response, next) => {
  if (request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: `You're Unauthorized To Perform This Operation!`,
    }
  }

  StringValidation({
    fieldName: 'Shipment Cost ID',
    data: request.params.id,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const { source, destination, days, maxCost, minCost, status } = request.body

  StringValidation({
    fieldName: 'Shipment Cost Source',
    data: source,
    minLength: 2,
    maxLength: 40,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Shipment Cost Destination',
    data: destination,
    minLength: 2,
    maxLength: 40,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Shipment Days',
    data: days,
    minValue: 1,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Shipment Minimum Cost',
    data: minCost,
    minValue: 0,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Shipment Maximum Cost',
    data: maxCost,
    minValue: 0,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Shipment Cost Status',
    data: status,
    isRequired: true,
    validValues: ['disabled', 'enabled'],
  })

  if (minCost > maxCost) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Minimum Cost Should Be Less Than Or Equal To Maximum Cost!'
    }
  }

  const payload = { _id: request.params.id }

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const shipmentCost = await ShipmentCost.findOne(payload)
    .populate(populate)

  if (!shipmentCost) {
    response.status(StatusCodes.NOT_FOUND).json({
      message: `Shipment Cost ${request.params.id} Not Found!`,
    })
  }

  shipmentCost.source = source
  shipmentCost.destination = destination
  shipmentCost.days = days
  shipmentCost.minCost = minCost
  shipmentCost.maxCost = maxCost
  shipmentCost.status = status
  shipmentCost.updatedBy = request.user._id

  await shipmentCost.save().then(() => {
    response.status(StatusCodes.OK).json(shipmentCost)
  }).catch(error => next(error))
}

const GetAllShipmentCosts = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const minified = request.query.minified || 'no'
  const payload = { '$or': [] }
  const data = []

  const { status, source, destination } = request.query

  StringValidation({
    fieldName: 'Shipment Cost Status',
    data: status,
    validValues: ['disabled', 'enabled'],
  })

  StringValidation({
    fieldName: 'Shipment Cost Minified Parameter',
    data: minified,
    validValues: ['yes', 'no'],
  })

  if (status) {
    payload.status = status
  }

  if (source) {
    payload['$or'].push({
      source: {
        '$regex': `${source.split(' ').join('|')}`,
        '$options': 'i'
      }
    })
  }

  if (destination) {
    payload['$or'].push({
      destination: {
        '$regex': `${destination.split(' ').join('|')}`,
        '$options': 'i'
      }
    })
  }

  // to check the total number of shipmentCosts we have in database that match the specified criteria
  const totalShipmentCosts = await ShipmentCost.count(payload)

  const populate = {
    path: 'createdBy updatedBy',
    model: 'user',
    select: '_id contactName',
  }

  const shipmentCosts = await ShipmentCost.find(payload)
    .populate(minified === 'yes' ? { path: '' } : populate)
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ updatedAt: 'desc' })

  shipmentCosts.forEach(shipmentCost => {
    const simpleData = {
      _id: shipmentCost._id,
      source: shipmentCost.source,
      destination: shipmentCost.destination,
      days: shipmentCost.days,
      maxCost: shipmentCost.maxCost,
      minCost: shipmentCost.minCost,
    }

    data.push(minified === 'yes' ? simpleData : shipmentCost)
  })

  response.status(StatusCodes.OK).json({
    totalShipmentCosts: totalShipmentCosts,
    page: page,
    limit: limit,
    count: data.length || 0,
    shipmentCosts: data,
  })
}

const GetShipmentCost = async (request, response, next) => {
  StringValidation({
    fieldName: 'Shipment Cost ID',
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

  const shipmentCost = await ShipmentCost.findOne(payload)
    .populate(populate)

  response.status(StatusCodes.OK).json(shipmentCost)
}

export { AddShipmentCost, UpdateShipmentCost, GetAllShipmentCosts, GetShipmentCost }