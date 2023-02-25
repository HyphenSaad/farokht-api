import { Tag, UnitOfMeasure, AttributeOfItem } from '../../models/index.js'
import { StatusCodes } from 'http-status-codes'

const ItemPrepare = async (request, response, next) => {
  const { name, minOrderNumber, description, userId, tags, attributes, unitOfMeasure,
    shipmentCosts, status, priceSlabs, completionDays, vendorPayoutPercentage } = JSON.parse(request.body.data)

  if (!name || !minOrderNumber || !description || !shipmentCosts || !tags || !unitOfMeasure || !attributes
    || !userId || !priceSlabs || !completionDays || !vendorPayoutPercentage)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  if (!Array.isArray(shipmentCosts) || !Array.isArray(tags) || !Array.isArray(attributes) || !Array.isArray(priceSlabs))
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Request Data-Shape!' }

  if (tags.length < 1)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tags are Required!' }

  const itemTags = []
  tags.forEach(async (tag, index) => {
    if (tag.hasOwnProperty('id') && tag.hasOwnProperty('name')) {
      if (tag.id.length === 24) itemTags.push(tag.id.toString())
      else {
        const object = await Tag.create({ name: tag.name, createdBy: request.user._id }).catch(error => next(error))
        if (object) itemTags.push(object._id)
      }
    } else throw { statusCode: StatusCodes.BAD_REQUEST, message: `Tag No. ${index + 1} has Invalid Shape!` }
  })

  const itemAttributes = []
  attributes.forEach(async (attribute, index) => {
    if (attribute.hasOwnProperty('id') && attribute.hasOwnProperty('name') && attribute.hasOwnProperty('value')) {
      if (attribute.id.length === 24) itemAttributes.push({ _id: attribute.id.toString(), value: attribute.value })
      else {
        const object = await AttributeOfItem.create({ name: attribute.name, createdBy: request.user._id }).catch(error => next(error))
        if (object) itemAttributes.push({ _id: object._id.toString(), value: object.name })
      }
    } else throw { statusCode: StatusCodes.BAD_REQUEST, message: `Attribute No. ${index + 1} has Invalid Shape!` }
  })

  if (unitOfMeasure.hasOwnProperty('id') && unitOfMeasure.hasOwnProperty('name')) {
    if (unitOfMeasure.id.length !== 24) {
      const object = await UnitOfMeasure.create({ name: unitOfMeasure.name, createdBy: request.user._id }).catch(error => next(error))
      if (object) unitOfMeasure.id = object._id.toString()
    }
  } else throw { statusCode: StatusCodes.BAD_REQUEST, message: `Unit of Measure has Invalid Shape!` }

  request.item = {
    name, minOrderNumber, description, userId,
    tags: itemTags, attributes: itemAttributes, unitOfMeasure: unitOfMeasure.id,
    shipmentCosts, priceSlabs, completionDays, vendorPayoutPercentage
  }

  if (request.user.role === 'admin')
    if (!status) throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status!' }
    else request.item.status = status

  next()
}

export default ItemPrepare