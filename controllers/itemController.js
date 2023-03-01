import { StatusCodes } from 'http-status-codes'
import { Item, User } from '../models/index.js'

const CreateItem = async (request, response, next) => {
  if (request.user.role === 'retailer')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  const user = await User.findOne({ _id: request.item.vendorId })
  if (!user)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Vendor ID!' }

  if (request.user.role !== 'admin')
    if (request.user._id.toString() !== request.item.vendorId)
      throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You Are Unauthorized To Perform This Operation!' }

  const item = await Item.create({
    ...request.item,
    updatedBy: request.user._id,
    createdBy: request.user._id,
  }).catch(error => next(error))
  if (item) await item.populate('tags unitOfMeasure attributes._id shipmentCosts').catch(error => next(error))
  response.status(StatusCodes.CREATED).json(item)
}

const UpdateItem = async (request, response, next) => {
  if (request.user.role === 'retailer')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.itemId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const item = await Item.findOne({ _id: request.params.itemId }).catch(error => next(error))

  if (!item)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Item ID!' }

  await item.populate('vendorId').catch(error => next(error))

  if (!request.item.vendorId || !item.vendorId)
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'Item Vendor Not Found!' }

  if (request.user.role !== 'admin')
    if (item.vendorId._id.toString() !== request.item.vendorId)
      throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You Are Unauthorized To Perform This Operation!' }

  if (request.user.role === 'admin') {
    const user = await User.findOne({ _id: request.item.vendorId }).catch(error => next(error))
    if (user.role !== 'vendor')
      throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Item Owner Can Only Be Vendor' }
    else
      item.vendorId = request.item.vendorId
  }

  item.name = request.item.name
  item.minOrderNumber = request.item.minOrderNumber
  item.maxOrderNumber = request.item.maxOrderNumber
  item.description = request.item.description
  item.tags = request.item.tags
  item.unitOfMeasure = request.item.unitOfMeasure
  item.attributes = request.item.attributes
  item.priceSlabs = request.item.priceSlabs
  item.vendorPayoutPercentage = request.item.vendorPayoutPercentage
  item.shipmentCosts = request.item.shipmentCosts
  item.updatedBy = request.item.updatedBy

  if (request.user.role === 'admin')
    item.status = request.item.status

  await item.save().then(() => {
    response.status(StatusCodes.OK).json(item)
  }).catch(error => next(error))
}

const SoftDeleteItem = async (request, response, next) => {
  if (request.user.role === 'retailer')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.itemId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const options = { _id: request.params.itemId }

  if (request.user.role === 'vendor') {
    options.vendorId = request.user._id.toString()

    const item = await Item.findOne(options).catch(error => next(error))
    if (!item)
      response.status(StatusCodes.NOT_FOUND).json({ message: `Item ${request.params.itemId} Not Found!` })

    item.status = 'suspended'
    item.updatedBy = request.item.updatedBy

    await item.save().then(() => {
      response.status(StatusCodes.OK).json({ message: `Item ${request.params.itemId} Deleted Successfully!` })
    }).catch(error => next(error))
  } else if (request.user.role === 'admin') {
    const item = await Item.deleteOne(options).catch(error => next(error))

    if (item.deletedCount !== 1)
      response.status(StatusCodes.NOT_FOUND).json({ message: `Item ${request.params.itemId} Not Found!` })
    else if (item.deletedCount === 1)
      response.status(StatusCodes.OK).json({ message: `Item ${request.params.itemId} Deleted Successfully!` })
  }
}

const GetItem = async (request, response, next) => {
  if (request.user.status === 'suspended')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Your account is not approved!' }

  if (!request.params.itemId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const options = { _id: request.params.itemId }

  if (request.user.role === 'retailer')
    options.status = 'enabled'

  const item = await Item.findOne(options).catch(error => next(error))
  if (!item)
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'Item Not Found!' }

  await item.populate('tags unitOfMeasure attributes._id shipmentCosts')
    .catch(error => next(error))

  await item.populate({ path: 'createdBy updatedBy vendorId', model: 'user', select: 'firstName lastName' })
    .catch(error => next(error))

  response.status(StatusCodes.OK).json(item)
}

const GetAllVendorItems = async (request, response, next) => {
  if (!request.params.vendorId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const options = { vendorId: request.params.vendorId }

  if (request.query.status === 'suspended' && request.user.role !== 'admin')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status Requested!' }

  if (request.user.role === 'retailer') {
    options.status = 'enabled'
  } else if (request.user.role === 'admin' && request.query.status) {
    options.status = request.query.status
  } else if (request.user.role === 'vendor' && request.query.status) {
    options.status = request.query.status
    options.vendorId = request.user._id
  }

  const items = await Item.find(options)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id shipmentCosts')
    .populate({ path: 'updatedBy createdBy vendorId', model: 'user', select: 'firstName lastName' })
    .sort({ updatedAt: 'desc' })
    .catch(error => next(error))

  const filteredItems = items.filter(item => {
    return (!tag) ? item : item.tags.map(tag => tag.name).includes(tag)
  })

  response.status(StatusCodes.OK).json({ page, limit, totalItems: filteredItems.length, items: filteredItems })
}

const GetAllItems = async (request, response, next) => {
  if (request.user.status === 'suspended')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Your account is not approved!' }

  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const tag = request.query.tag || ''
  const options = {}

  if (request.query.status === 'suspended' && request.user.role !== 'admin')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status Requested!' }

  if (request.query.minOrderNumber)
    if (isNaN(request.query.minOrderNumber))
      throw { statusCode: StatusCodes.BAD_REQUEST, message: 'MinOrderNumber Should Be Numeric Only!' }
    else if (request.query.minOrderNumber)
      options.minOrderNumber = { '$lte': `${request.query.minOrderNumber}` }

  if (request.user.role === 'admin' && request.query.status)
    options.status = request.query.status

  if (request.query.name)
    options.name = { '$regex': `${request.query.name}`, '$options': 'i' }

  const items = await Item.find(options)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id shipmentCosts')
    .populate({ path: 'updatedBy createdBy vendorId', model: 'user', select: 'firstName lastName' })
    .sort({ updatedAt: 'desc' })
    .catch(error => next(error))

  const filteredItems = items.filter(item => {
    return (!tag) ? item : item.tags.map(tag => tag.name).includes(tag)
  })

  response.status(StatusCodes.OK).json({ page, limit, totalItems: filteredItems.length, items: filteredItems })
}

export { CreateItem, UpdateItem, SoftDeleteItem, GetItem, GetAllVendorItems, GetAllItems }