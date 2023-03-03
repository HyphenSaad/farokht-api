import { StatusCodes } from 'http-status-codes'
import { Item, User } from '../models/index.js'
import { StringValidation } from '../utilities.js'

const CreateItem = async (request, response, next) => {
  if (request.user.role === 'retailer') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You\'re Unauthorized To Perform This Operation!'
    }
  }

  const user = await User.findOne({ _id: request.item.vendorId })
  if (!user) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid Vendor ID!'
    }
  }

  if (request.user.role === 'vendor') {
    if (request.user._id.toString() !== request.item.vendorId.toString()
      || request.user.status !== 'approved') {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'You Are Unauthorized To Perform This Operation!',
      }
    }
  }

  const payload = {
    ...request.item,
    updatedBy: request.user._id,
    createdBy: request.user._id,
    pictures: ['hhhhhhh', 'mmmmmmmmm']
  }

  const item = await Item.create(payload)

  if (item) {
    await User.updateOne({ _id: request.item.vendorId, }, {
      $push: {
        items: item._id,
      },
    })
  }

  response.status(StatusCodes.CREATED).json(item)
}

const UpdateItem = async (request, response, next) => {
  if (request.user.role === 'retailer') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You\'re Unauthorized To Perform This Operation!'
    }
  }

  StringValidation({
    fieldName: 'Item ID',
    data: request.params.itemId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const item = await Item.findOne({ _id: request.params.itemId })
  if (!item) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid Item ID!'
    }
  }

  await item.populate({ path: 'vendorId', model: 'user', select: '_id contactName' })

  if (!request.item.vendorId || !item.vendorId) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Item Vendor Not Found!'
    }
  }

  if (request.user.role === 'vendor') {
    if (item.vendorId._id.toString() !== request.item.vendorId.toString()
      || request.user.status !== 'approved') {
      throw {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'You Are Unauthorized To Perform This Operation!'
      }
    }
  }

  if (request.user.role === 'admin') {
    const user = await User.findOne({ _id: request.item.vendorId })

    if (user.role !== 'vendor') {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Item Owner Can Only Be Vendor'
      }
    } else {
      item.vendorId = request.item.vendorId
    }
  }

  item.name = request.item.name
  item.minOrderQuantity = request.item.minOrderQuantity
  item.maxOrderQuantity = request.item.maxOrderQuantity
  item.description = request.item.description
  item.tags = request.item.tags
  item.unitOfMeasure = request.item.unitOfMeasure
  item.attributes = request.item.attributes
  item.priceSlabs = request.item.priceSlabs
  item.vendorPayoutPercentage = request.item.vendorPayoutPercentage
  item.shipmentCosts = request.item.shipmentCosts
  item.completionDays = request.item.completionDays
  item.updatedBy = request.item.updatedBy

  if (request.user.role === 'admin') {
    item.status = request.item.status

    if (request.item.vendorId.toString() !== item.vendorId.toString()) {
      await User.updateOne({ _id: item.vendorId }, {
        $pull: { items: item._id },
      })

      await User.updateOne({ _id: request.item.vendorId, }, {
        $push: { items: item._id, },
      })

      item.vendorId = request.item.vendorId
    }
  }

  await item.save().then(() => {
    response.status(StatusCodes.OK).json(item)
  })
}

const DeleteItem = async (request, response, next) => {
  if (request.user.role === 'retailer') {
    throw {
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'You\'re Unauthorized To Perform This Operation!'
    }
  }

  StringValidation({
    fieldName: 'Item ID',
    data: request.params.itemId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const payload = { _id: request.params.itemId }

  if (request.user.role === 'vendor') {
    payload.vendorId = request.user._id.toString()

    const item = await Item.findOne(payload)
    if (!item) {
      throw {
        statusCode: StatusCodes.NOT_FOUND,
        message: `Item ${request.params.itemId} Not Found!`
      }
    }

    item.status = 'suspended'
    item.updatedBy = request.item.updatedBy

    await item.save().then(() => {
      response.status(StatusCodes.OK).json({
        message: `Item ${request.params.itemId} Deleted Successfully!`
      })
    })
  } else if (request.user.role === 'admin') {
    const item = await Item.findOne(payload)

    await User.updateOne({ _id: item.vendorId }, {
      $pull: { items: item._id },
    })

    await item.remove().then(() => {
      response.status(StatusCodes.OK).json({
        message: `Item ${request.params.itemId} Deleted Succesfully!`
      })
    })
  }
}

const GetItem = async (request, response, next) => {
  StringValidation({
    fieldName: 'Item ID',
    data: request.params.itemId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const payload = { _id: request.params.itemId }

  if (request.user.role === 'retailer') {
    payload.status = 'enabled'
  }

  const item = await Item.findOne(payload)
  if (!item) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'Item Not Found!'
    }
  }

  const populate = {
    path: 'createdBy updatedBy vendorId',
    model: 'user',
    select: '_id contactName',
  }

  await item.populate('tags unitOfMeasure attributes._id shipmentCosts')
  await item.populate(populate)

  response.status(StatusCodes.OK).json(item)
}

const GetAllVendorItems = async (request, response, next) => {
  const payload = { _id: request.params.userId }

  StringValidation({
    fieldName: 'User ID',
    data: request.params.userId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const user = await User.findOne(payload)
    .populate('items')
    .populate({ path: 'items.attributes._id', model: 'attributeOfItem' })
    .populate({ path: 'items.tags', model: 'tag' })
    .populate({ path: 'items.shipmentCosts', model: 'shipmentCost' })
    .populate({ path: 'items.unitOfMeasure', model: 'unitOfMeasure' })

  if (!user) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid Vendor ID!'
    }
  }

  response.status(StatusCodes.OK).json({
    items: user.items
  })
}

const GetAllItems = async (request, response, next) => {
  const page = request.query.page || 1
  const limit = request.query.limit || 10
  const tag = request.query.tag || ''
  const payload = {}

  if (request.query.status === 'suspended' && request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid Item Status Requested!'
    }
  }

  if (request.query.minOrderQuantity) {
    if (isNaN(request.query.minOrderQuantity)) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'MinOrderNumber Should Be Numeric Only!'
      }
    }
    else if (request.query.minOrderQuantity) {
      payload.minOrderQuantity = {
        '$lte': `${request.query.minOrderQuantity}`,
      }
    }
  }

  if (request.user.role === 'admin' && request.query.status) {
    payload.status = request.query.status
  }

  if (request.query.name) {
    payload.name = { '$regex': `${request.query.name}`, '$options': 'i' }
  }

  const items = await Item.find(payload)
    .limit(limit)
    .skip((page - 1) * limit)
    .populate('tags unitOfMeasure attributes._id shipmentCosts')
    .populate({ path: 'updatedBy createdBy vendorId', model: 'user', select: '_id contactName' })
    .sort({ updatedAt: 'desc' })

  const filteredItems = items.filter(item => {
    return (!tag) ? item : item.tags.map(tag => tag.name).includes(tag)
  })

  response.status(StatusCodes.OK).json({
    totalItems: filteredItems.length,
    page: page,
    limit: limit,
    items: filteredItems,
  })
}

export { CreateItem, UpdateItem, DeleteItem, GetItem, GetAllVendorItems, GetAllItems }