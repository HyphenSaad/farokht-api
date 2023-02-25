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

  try {
    const itemTags = []
    tags.forEach(async tag => {
      if (tag.id !== '') {
        itemTags.push(tag.id)
      } else {
        const object = await Tag.create({ name: tag.value, createdBy: request.user._id })
        itemTags.push(object.id)
      }
    })

    const itemAttributes = []
    attributes.forEach(async attribute => {
      if (attribute.hasOwnProperty('id')) {
        itemTags.push({ _id: attribute.id, value: attribute.value })
      } else {
        const object = await AttributeOfItem.create({ name: attribute.name, createdBy: request.user._id })
        itemTags.push({ _id: object.id, value: attribute.value })
      }
    })

    if (unitOfMeasure.id === '') {
      const object = await AttributeOfItem.create({ name: unitOfMeasure.value, createdBy: request.user._id })
      unitOfMeasure.id = object._id
    }

    request.item = {
      name, minOrderNumber, description, userId,
      tags: itemTags, attributes: itemAttributes, unitOfMeasure,
      shipmentCosts, priceSlabs, completionDays, vendorPayoutPercentage
    }

    if (request.user.role === 'admin')
      if (!status) throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status!' }
      else request.item.status = status

    next()
  } catch (error) {
    return next(error)
  }
}

export default ItemPrepare