import { StatusCodes } from 'http-status-codes'
import { Item, User } from '../models/index.js'

const CreateItem = async (request, response, next) => {
  if (request.user.role === 'retailer')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  const user = await User.findOne({ _id: request.item.userId })
  if (!user)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Vendor ID!' }

  if (request.user.role !== 'admin')
    if (request.user._id.toString() !== request.item.userId)
      throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You Are Unauthorized To Perform This Operation!' }

  const item = await Item.create(request.item).catch(error => next(error))
  if (item) await item.populate('tags unitOfMeasure attributes._id').catch(error => next(error))
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

  await item.populate('userId').catch(error => next(error))

  if (!request.item.userId || !item.userId)
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'Item Vendor Not Found!' }

  if (request.user.role !== 'admin')
    if (item.userId._id.toString() !== request.item.userId)
      throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You Are Unauthorized To Perform This Operation!' }

  if (request.user.role === 'admin') {
    const user = await User.findOne({ _id: request.item.userId }).catch(error => next(error))
    if (user.role !== 'vendor')
      throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Item Owner Can Only Be Vendor' }
    else
      item.userId = request.item.userId
  }

  item.name = request.item.name
  item.minOrderNumber = request.item.minOrderNumber
  item.description = request.item.description
  item.tags = request.item.tags
  item.unitOfMeasure = request.item.unitOfMeasure
  item.attributes = request.item.attributes
  item.priceSlabs = request.item.priceSlabs
  item.vendorPayoutPercentage = request.item.vendorPayoutPercentage
  item.shipmentCosts = request.item.shipmentCosts

  if (request.user.role === 'admin')
    item.status = request.item.status

  await item.save().then(() => {
    response.status(StatusCodes.OK).json(item)
  }).catch(error => next(error))
}

const DeleteItem = async (request, response, next) => {
  if (request.user.role === 'retailer')
    throw { statusCode: StatusCodes.UNAUTHORIZED, message: 'You\'re Unauthorized To Perform This Operation!' }

  if (!request.params.itemId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const options = { _id: request.params.itemId }

  if (request.user.role === 'vendor')
    options.userId = request.user._id.toString()

  const item = await Item.findOne(options).catch(error => next(error))
  if (!item)
    response.status(StatusCodes.NOT_FOUND).json({ message: `Item ${request.params.itemId} Not Found!` })

  item.status = 'suspended'

  await item.save().then(() => {
    response.status(StatusCodes.OK).json({ message: `Item ${request.params.itemId} Deleted Successfully!` })
  }).catch(error => next(error))
}

const GetItem = async (request, response, next) => {
  if (!request.params.itemId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Item ID is Required!' }

  const options = { _id: request.params.itemId }

  if (request.user.role === 'retailer')
    options.status = 'enabled'

  const item = await Item.findOne(options).catch(error => next(error))
  if (!item)
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'Item Not Found!' }

  await item.populate('tags unitOfMeasure attributes._id userId').catch(error => next(error))

  item.userId.phoneNumber1 = undefined
  item.userId.phoneNumber2 = undefined
  item.userId.landline = undefined
  item.userId.email = undefined
  item.userId.companyName = undefined
  item.userId.location = undefined
  item.userId.address = undefined
  item.userId.paymentMethod = undefined
  item.userId.bankName = undefined
  item.userId.bankBranchCode = undefined
  item.userId.bankAccountNumber = undefined
  item.userId.createdAt = undefined
  item.userId.updatedAt = undefined
  item.userId.role = undefined

  response.status(StatusCodes.OK).json(item)
}

// FIXME: Es Mai One-To-Many Ka Relation Impletment Karna Hai, Tan K User K Items Search Nah Karni Parhain Humain
const GetAllVendorItems = async (request, response, next) => {
  if (!request.params.userId)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'User ID is Required!' }

  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const options = { userId: request.params.userId }

  if (request.query.status === 'suspended' && request.user.role !== 'admin')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status Requested!' }

  if (request.user.role === 'retailer') {
    options.status = 'enabled'
  } else if (request.user.role === 'admin' && request.query.status) {
    options.status = request.query.status
  } else if (request.user.role === 'vendor' && request.query.status) {
    options.status = request.query.status
    options.userId = request.user._id
  }

  const items = await Item.find(options)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id')
    .sort({ createdAt: 'desc', updatedAt: 'desc' })
    .catch(error => next(error))

  response.status(StatusCodes.OK).json({ count: items.length, items })
}

const GetAllItems = async (request, response, next) => {
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
    .populate('tags unitOfMeasure attributes._id userId')
    .sort({ createdAt: 'desc', updatedAt: 'desc' })
    .catch(error => next(error))

  const filteredItems = items.filter(item => {
    return (!tag) ? item : item.tags.map(tag => tag.name).includes(tag)
  })

  filteredItems.map(item => {
    item.userId.phoneNumber1 = undefined
    item.userId.phoneNumber2 = undefined
    item.userId.landline = undefined
    item.userId.email = undefined
    item.userId.companyName = undefined
    item.userId.location = undefined
    item.userId.address = undefined
    item.userId.paymentMethod = undefined
    item.userId.bankName = undefined
    item.userId.bankBranchCode = undefined
    item.userId.bankAccountNumber = undefined
    item.userId.createdAt = undefined
    item.userId.updatedAt = undefined
    item.userId.role = undefined
  })

  response.status(StatusCodes.OK).json({ page, limit, totalItems: filteredItems.length, items: filteredItems })
}

export { CreateItem, UpdateItem, DeleteItem, GetItem, GetAllVendorItems, GetAllItems }