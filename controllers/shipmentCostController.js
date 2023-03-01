import { StatusCodes } from 'http-status-codes'
import { ShipmentCost } from '../models/index.js'

const AddShipmentCost = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  const { source, destination, days, maxCost, minCost, status } = request.body
  if (!source || !destination || !days || !maxCost || !minCost || !status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const shipmentCost = await ShipmentCost.create({
    source,
    destination,
    days,
    maxCost,
    minCost,
    status,
    updatedBy: request.user._id,
    createdBy: request.user._id
  }).populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.CREATED).json(shipmentCost)
}

const UpdateShipmentCost = async (request, response, next) => {
  if (request.user.role !== 'admin')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Shipment Cost ID is Required!' }

  const { source, destination, days, maxCost, minCost, status } = request.body
  if (!source || !destination || !days || !maxCost || !minCost || !status)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const options = { _id: request.params.id }
  const shipmentCost = await ShipmentCost.findOne(options).catch(error => next(error))

  if (!shipmentCost)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Shipment Cost ${request.params.id} Not Found!` })

  shipmentCost.source = source
  shipmentCost.destination = destination
  shipmentCost.days = days
  shipmentCost.minCost = minCost
  shipmentCost.maxCost = maxCost
  shipmentCost.status = status
  shipmentCost.updatedBy = request.user._id

  await shipmentCost.populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  await shipmentCost.save().then(() => {
    response.status(StatusCodes.OK).json(shipmentCost)
  }).catch(error => next(error))
}

const GetAllShipmentCosts = async (request, response, next) => {
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

  const shipmentCostsCount = await ShipmentCost.count(options).catch(error => next(error))

  if (minified === 'yes') {
    const shipmentCosts = await ShipmentCost.find(options)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    shipmentCosts.forEach(shipmentCost => data.push({
      _id: shipmentCost._id,
      source: shipmentCost.source,
      destination: shipmentCost.destination,
      days: shipmentCost.days,
      maxCost: shipmentCost.maxCost,
      minCost: shipmentCost.minCost,
    }))
  } else {
    const shipmentCosts = await ShipmentCost.find(options)
      .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ updatedAt: 'desc' })
      .catch(error => next(error))

    shipmentCosts.forEach(shipmentCost => data.push(shipmentCost))
  }

  response.status(StatusCodes.OK).json({
    totalShipmentCosts: shipmentCostsCount, page, limit,
    count: data.length || 0, shipmentCosts: data
  })
}

const GetShipmentCost = async (request, response, next) => {
  if (!request.params.id)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Shipment Cost ID is Required!' }

  const shipmentCost = await ShipmentCost.findOne({ _id: request.params.id })
    .populate({ path: 'createdBy updatedBy', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.OK).json(shipmentCost)
}

export { AddShipmentCost, UpdateShipmentCost, GetAllShipmentCosts, GetShipmentCost }