import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/index.js'
import { Item, User } from '../models/index.js'

const CreateItem = async (request, response, next) => {
  const user = await User.findOne({ _id: request.item.userId })
  if (!user) throw new BadRequestError('Invalid Vendor ID!')

  if (request.user.role !== 'admin')
    if (request.user._id.toString() !== request.item.userId)
      throw new BadRequestError('You Are Unauthorized To Perform This Operation!')

  const item = await Item.create(request.item)
  await item.populate('tags unitOfMeasure attributes._id')
  response.status(StatusCodes.OK).json(item)
}

const UpdateItem = async (request, response, next) => {
  if (!request.params.itemId)
    throw new BadRequestError('Item ID is Required!')

  const item = await Item.findOne({ _id: request.params.itemId })
  if (!item) throw new BadRequestError('Invalid Item ID!')
  await item.populate('userId')

  // if (!item.userId) throw new BadRequestError('Item Vendor Not Found!')
  if (!request.item.userId) throw new BadRequestError('Item Vendor Not Found!')

  if (request.user.role !== 'admin')
    if (item.userId._id.toString() !== request.item.userId)
      throw new BadRequestError('You Are Unauthorized To Perform This Operation!')

  if (request.user.role === 'admin') {
    const user = await User.findOne({ _id: request.item.userId })
    if (user.role !== 'vendor') throw new BadRequestError('Item Owner Can Only Be Vendor')
    else item.userId = request.item.userId
  }

  item.name = request.item.name
  item.minOrderNumber = request.item.minOrderNumber
  item.description = request.item.description
  if (request.user.role === 'admin') item.status = request.item.status
  item.tags = request.item.tags.map(tag => tag._id)
  item.attributes = request.item.attributes.map(attribute => { return { _id: attribute._id, value: attribute.value } })
  item.unitOfMeasure = request.item.unitOfMeasure._id
  item.pictures = request.item.pictures

  await item.save().then(() => {
    response.status(StatusCodes.OK).json({
      _id: item._id,
      name: item.name,
      minOrderNumber: item.minOrderNumber,
      description: item.description,
      userId: item.userId._id,
      tags: request.item.tags,
      attributes: request.item.attributes,
      unitOfMeasure: request.item.unitOfMeasure,
      pictures: request.item.pictures,
      status: item.status
    })
  }).catch(error => next(error))
}

const DeleteItem = async (request, response, next) => {
  if (!request.params.itemId) throw new BadRequestError('Item ID is Required!')

  const options = { _id: request.params.itemId }
  if (request.user.role === 'vendor') options.userId = request.user._id.toString()

  const output = await Item.deleteOne(options)
  if (output.deletedCount > 0)
    response.status(StatusCodes.OK).json({ message: `Item ${request.params.itemId} Deleted Successfully!` })
  else
    response.status(StatusCodes.NOT_FOUND).json({ message: `Item ${request.params.itemId} Not Found!` })
}

const GetItem = async (request, response, next) => {
  if (!request.params.itemId) throw new BadRequestError('Item ID is Required!')

  const options = { _id: request.params.itemId }
  if (request.user.role === 'retailer') options.status = 'enabled'

  const item = await Item.findOne(options)
  if (!item) throw new BadRequestError('Item Not Found!')
  await item.populate('tags unitOfMeasure attributes._id')
  response.status(StatusCodes.OK).json(item)
}

const GetAllVendorItems = async (request, response, next) => {
  if (!request.params.userId) throw new BadRequestError('User ID is Required!')

  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const options = { userId: request.params.userId }

  if (request.user.role === 'retailer') options.status = 'enabled'
  else if (request.user.role === 'admin' && request.query.status) options.status = request.query.status
  else if (request.user.role === 'vendor' && request.query.status) {
    options.status = request.query.status
    options.userId = request.user._id
  }

  const items = await Item.find(options)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id')
  response.status(StatusCodes.OK).json({ count: items.length, items })
}

const GetAllItems = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const tag = request.query.tag || ''
  const options = {}

  if (request.user.role === 'admin' && request.query.status) options.status = request.query.status
  if (request.query.name) options.name = { '$regex': `${request.query.name}`, '$options': 'i' }

  const items = (await Item.find(options).limit(limit).skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id')).filter(item => {
      if (!tag) return item
      return item.tags.map(tag => tag.name).includes(tag)
    })

  response.status(StatusCodes.OK).json({ page, limit, count: items.length, items })
}

export { CreateItem, UpdateItem, DeleteItem, GetItem, GetAllVendorItems, GetAllItems }