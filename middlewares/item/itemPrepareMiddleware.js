import { Tag, UnitOfMeasure, AttributeOfItem } from '../../models/index.js'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'

const ItemPrepare = async (request, response, next) => {
  const { name,
    minOrderNumber,
    maxOrderNumber,
    description,
    vendorId,
    tags,
    attributes,
    unitOfMeasure,
    shipmentCosts,
    status,
    priceSlabs,
    completionDays,
    vendorPayoutPercentage } = JSON.parse(request.body.data)

  if (!name ||
    !minOrderNumber ||
    !description ||
    !shipmentCosts ||
    !tags ||
    !unitOfMeasure ||
    !attributes ||
    !vendorId ||
    !priceSlabs ||
    !completionDays ||
    !vendorPayoutPercentage)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  if (maxOrderNumber && minOrderNumber > maxOrderNumber)
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Minimum Order Should Be Less Than Or Equal To Maximum Order!'
    }

  if (!Array.isArray(shipmentCosts) ||
    !Array.isArray(tags) ||
    !Array.isArray(attributes) ||
    !Array.isArray(priceSlabs))
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Request Data-Shape!' }

  if (tags.length < 1)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Tags are Required!' }
  else if (attributes.length < 1)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Attributes are Required!' }
  else if (priceSlabs.length < 1)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Price Slabs are Required!' }
  else if (shipmentCosts.length < 1)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Shipment Costs are Required!' }

  priceSlabs.forEach((priceSlab, index) => {
    if (priceSlabs[index].hasOwnProperty('slab') && priceSlabs[index].hasOwnProperty('price')) {
      if (index > 0)
        try {
          if (Number(priceSlabs[index - 1].slab) >= Number(priceSlab.slab))
            throw {
              statusCode: StatusCodes.BAD_REQUEST,
              message: `Slab No. ${index} Should Be Less Than Slab No. ${index + 1}`
            }
        } catch (error) { next(error) }
    } else throw { statusCode: StatusCodes.BAD_REQUEST, message: `Price Slab No. ${index + 1} has Invalid Shape!` }
  })

  if (request.user.role === 'admin') {
    const itemTags = []
    tags.forEach(async (tag, index) => {
      if (tag.hasOwnProperty('id') && tag.hasOwnProperty('name')) {
        if (tag.id.length === 24) itemTags.push(mongoose.Types.ObjectId(tag.id.toString()))
        else {
          const object = await Tag.create({
            name: tag.name,
            updatedBy: request.user._id,
            createdBy: request.user._id,
          }).catch(error => next(error))
          if (object) itemTags.push(object._id)
        }
      } else throw { statusCode: StatusCodes.BAD_REQUEST, message: `Tag No. ${index + 1} has Invalid Shape!` }
    })

    const itemAttributes = []
    attributes.forEach(async (attribute, index) => {
      if (attribute.hasOwnProperty('id') && attribute.hasOwnProperty('name') && attribute.hasOwnProperty('value')) {
        if (attribute.id.length === 24) itemAttributes.push({ _id: mongoose.Types.ObjectId(attribute.id.toString()), value: attribute.value })
        else {
          const object = await AttributeOfItem.create({
            name: attribute.name,
            updatedBy: request.user._id,
            createdBy: request.user._id,
          }).catch(error => next(error))
          if (object) itemAttributes.push({ _id: object._id, value: object.name })
        }
      } else throw { statusCode: StatusCodes.BAD_REQUEST, message: `Attribute No. ${index + 1} has Invalid Shape!` }
    })

    if (unitOfMeasure.hasOwnProperty('id') && unitOfMeasure.hasOwnProperty('name')) {
      if (unitOfMeasure.id.length !== 24) {
        const object = await UnitOfMeasure.create({
          name: unitOfMeasure.name,
          updatedBy: request.user._id,
          createdBy: request.user._id,
        }).catch(error => next(error))
        if (object) unitOfMeasure.id = object._id
      }
    } else throw { statusCode: StatusCodes.BAD_REQUEST, message: `Unit of Measure has Invalid Shape!` }

    request.item = {
      tags: itemTags,
      attributes: itemAttributes,
      unitOfMeasure: unitOfMeasure.id
    }

    // if (!status) throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status!' }
    // else request.item.status = status
  } else {
    request.item = {
      tags,
      attributes,
      unitOfMeasure
    }
  }

  request.item = {
    ...request.item,
    name,
    minOrderNumber,
    maxOrderNumber,
    description,
    vendorId,
    shipmentCosts,
    priceSlabs,
    completionDays,
    vendorPayoutPercentage,
    updatedBy: request.user._id
  }

  next()
}

export default ItemPrepare