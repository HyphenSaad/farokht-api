import { StatusCodes } from 'http-status-codes'
import { User } from '../../models/index.js'
import { ArrayValidation, StringValidation, NumberValidation } from '../../utilities.js'
import { __AddTag, __AddAttribute, __AddUnitOfMeasure } from '../../controllers/index.js'

const ItemPrepare = async (request, response, next) => {
  const {
    name,
    minOrderQuantity,
    maxOrderQuantity,
    description,
    vendorId,
    tags,
    attributes,
    unitOfMeasure,
    shipmentCosts,
    status,
    priceSlabs,
    completionDays,
    vendorPayoutPercentage
  } = request.body

  StringValidation({
    fieldName: 'Item Name',
    data: name,
    minLength: 3,
    maxLength: 25,
    isRequired: true,
    regEx: /^[a-zA-Z0-9-|&\s]+$/,
    regExMessage: `Item Name should only contains alphabets and digits!`
  })

  NumberValidation({
    fieldName: 'Minimum Order Quantity',
    data: minOrderQuantity,
    minValue: 1,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Maximum Order Quantity',
    data: maxOrderQuantity,
    minValue: 0,
    isRequired: false,
  })

  StringValidation({
    fieldName: 'Item Description',
    data: description,
    minLength: 10,
    maxLength: 255,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'Item Status',
    data: status,
    isRequired: true,
    validValues: ['disabled', 'enabled'],
  })

  StringValidation({
    fieldName: 'Vendor ID',
    data: vendorId,
    minLength: 24,
    maxLength: 24,
    isRequired: true,
  })

  const vendor = await User.findOne({ _id: vendorId })
  if (!vendor) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Vendor ${vendorId} not found!`
    }
  }

  if (vendor.role !== 'vendor') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${vendorId} - Invalid Vendor!`
    }
  }

  NumberValidation({
    fieldName: 'Vendor Payout Percentage',
    data: vendorPayoutPercentage,
    minValue: 0,
    isRequired: true,
  })

  NumberValidation({
    fieldName: 'Completion Days',
    data: completionDays,
    minValue: 1,
    isRequired: true,
  })

  if (maxOrderQuantity && minOrderQuantity > maxOrderQuantity) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Minimum Order Should Be Less Than Or Equal To Maximum Order!'
    }
  }

  ArrayValidation({
    fieldName: 'Shipment Costs',
    data: shipmentCosts,
  })

  shipmentCosts.forEach((shipmentCost, index) => {
    StringValidation({
      fieldName: `Shipment Cost No. ${index}`,
      data: shipmentCost,
      minLength: 24,
      maxLength: 24,
      isRequired: true,
    })
  })

  ArrayValidation({
    fieldName: 'Tags',
    data: tags,
  })

  ArrayValidation({
    fieldName: 'Attributes',
    data: attributes,
  })

  ArrayValidation({
    fieldName: 'Price Slabs',
    data: priceSlabs,
  })

  priceSlabs.forEach((priceSlab, index) => {
    if (priceSlabs[index].hasOwnProperty('slab')
      && priceSlabs[index].hasOwnProperty('price')) {
      if (index > 0) {
        if (Number(priceSlabs[index - 1].slab) >= Number(priceSlab.slab)) {
          throw {
            statusCode: StatusCodes.BAD_REQUEST,
            message: `Slab No. ${index} Should Be Less Than Slab No. ${index + 1}`
          }
        }
      }
    } else {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Price Slab No. ${index + 1} has Invalid Shape!`
      }
    }
  })

  if (request.user.role === 'admin') {
    const itemTags = []
    for (let index = 0; index < tags.length; index += 1) {
      if (tags[index].hasOwnProperty('id') && tags[index].hasOwnProperty('name')) {
        request.body.name = tags[index].name
        request.__fromItemPrepare = true

        const tag = await __AddTag(request)
        itemTags.push(tag._id.toString())
      } else {
        throw {
          statusCode: StatusCodes.BAD_REQUEST,
          message: `Tag No. ${index + 1} has Invalid Shape!`
        }
      }
    }

    const itemAttributes = []
    for (let index = 0; index < attributes.length; index += 1) {
      if (attributes[index].hasOwnProperty('id') && attributes[index].hasOwnProperty('name')
        && attributes[index].hasOwnProperty('values')) {

        request.body.name = attributes[index].name
        request.__fromItemPrepare = true

        const attribute = await __AddAttribute(request)

        ArrayValidation({
          fieldName: `Attribute No. ${index + 1} Values`,
          data: attributes[index].values,
          isRequired: true,
        })

        if (attributes.values.length > 10) {
          throw {
            statusCode: StatusCodes.BAD_REQUEST,
            message: `Attribute No. ${index + 1} Values Limit Exceed!`
          }
        }

        attributes[index].values.forEach((value, i) => {
          StringValidation({
            fieldName: `Attribute No. ${index + 1} Value No. ${i + 1}`,
            data: value,
            minLength: 1,
            maxLength: 50,
            isRequired: true,
          })
        })

        itemAttributes.push({
          _id: attribute._id,
          values: attributes[index].values.filter((value, index, array) => {
            return array.indexOf(value) === index
          })
        })
      } else {
        throw {
          statusCode: StatusCodes.BAD_REQUEST,
          message: `Attribute No. ${index + 1} has Invalid Shape!`
        }
      }
    }

    StringValidation({
      fieldName: 'Unit of Measure ID',
      data: unitOfMeasure.id,
      minLength: 24,
      maxLength: 24,
      isRequired: true,
    })

    if (unitOfMeasure.hasOwnProperty('id') && unitOfMeasure.hasOwnProperty('name')) {
      request.body.name = unitOfMeasure.name
      request.__fromItemPrepare = true

      const __unitOfMeasure = await __AddUnitOfMeasure(request)
      unitOfMeasure.id = __unitOfMeasure._id.toString()
    } else {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Unit of Measure has Invalid Shape!`
      }
    }

    request.item = {
      tags: itemTags,
      attributes: itemAttributes,
      unitOfMeasure: unitOfMeasure.id
    }
  } else {
    request.item = {
      tags,
      attributes,
      unitOfMeasure
    }
  }

  request.item.tags = request.item.tags.filter((value, index, array) => {
    return array.indexOf(value) === index
  })

  request.item.shipmentCosts = shipmentCosts.filter((value, index, array) => {
    return array.indexOf(value) === index
  })

  if (request.item.tags.length > 25) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Item Tags can't be more than 25!`
    }
  }

  if (request.item.attributes.length > 10) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Item Attributes can't be more than 10!`
    }
  }

  request.item = {
    ...request.item,
    name,
    minOrderQuantity,
    maxOrderQuantity,
    description,
    vendorId,
    priceSlabs,
    completionDays,
    vendorPayoutPercentage,
    updatedBy: request.user._id
  }

  next()
}

export default ItemPrepare