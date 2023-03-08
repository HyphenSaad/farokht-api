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

  request.item = {}

  StringValidation({
    fieldName: 'Item Name',
    data: name,
    minLength: 3,
    maxLength: 25,
    isRequired: request.method === 'POST',
    regEx: /^[a-zA-Z0-9-|&\s]+$/,
    regExMessage: `Item Name should only contains alphabets and digits!`
  })

  NumberValidation({
    fieldName: 'Minimum Order Quantity',
    data: minOrderQuantity,
    minValue: 1,
    isRequired: request.method === 'POST',
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
    isRequired: request.method === 'POST',
  })

  if (request.user.role === 'admin') {
    StringValidation({
      fieldName: 'Item Status',
      data: status,
      isRequired: request.method === 'POST',
      validValues: ['disabled', 'enabled'],
    })

    StringValidation({
      fieldName: 'Vendor ID',
      data: vendorId,
      minLength: 24,
      maxLength: 24,
      isRequired: request.method === 'POST',
    })

    if (vendorId) {
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
    }
  }

  NumberValidation({
    fieldName: 'Vendor Payout Percentage',
    data: vendorPayoutPercentage,
    minValue: 0,
    isRequired: request.method === 'POST',
  })

  NumberValidation({
    fieldName: 'Completion Days',
    data: completionDays,
    minValue: 1,
    isRequired: request.method === 'POST',
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
    isRequired: request.method === 'POST'
  })

  if (shipmentCosts) {
    shipmentCosts.forEach((shipmentCost, index) => {
      if (shipmentCost.hasOwnProperty('location') && shipmentCost.hasOwnProperty('cost')
        && shipmentCost.hasOwnProperty('days')) {
        StringValidation({
          fieldName: `Shipment Cost No. ${index + 1} Location`,
          data: shipmentCost.location,
          minLength: 2,
          maxLength: 75,
          isRequired: true,
        })

        NumberValidation({
          fieldName: `Shipment Cost No. ${index + 1} Cost`,
          data: shipmentCost.cost,
          minValue: 1,
          isRequired: true,
        })

        NumberValidation({
          fieldName: `Shipment Cost No. ${index + 1} Days`,
          data: shipmentCost.days,
          minValue: 1,
          isRequired: true,
        })
      } else {
        throw {
          statusCode: StatusCodes.BAD_REQUEST,
          message: `Shipment Cost No. ${index + 1} has Invalid Shape!`
        }
      }
    })
  }

  ArrayValidation({
    fieldName: 'Tags',
    data: tags,
    isRequired: request.method === 'POST',
  })

  ArrayValidation({
    fieldName: 'Attributes',
    data: attributes,
    isRequired: request.method === 'POST',
  })

  ArrayValidation({
    fieldName: 'Price Slabs',
    data: priceSlabs,
    isRequired: request.method === 'POST',
  })

  if (priceSlabs) {
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
  }

  if (request.user.role === 'admin') {
    const itemTags = []
    if (tags) {
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

      request.item.tags = itemTags
    }

    const itemAttributes = []
    if (attributes) {
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

      request.item.attributes = itemAttributes
    }

    if (unitOfMeasure) {
      StringValidation({
        fieldName: 'Unit of Measure ID',
        data: unitOfMeasure.id,
        minLength: 24,
        maxLength: 24,
        isRequired: request.method === 'POST',
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

      request.item.unitOfMeasure = unitOfMeasure.id
    }
  } else {
    if (attributes) {
      request.item.attributes = attributes.map(attribute => {
        return {
          _id: attribute.id,
          values: attribute.values
        }
      })
    }

    if (tags) {
      request.item.tags = tags
    }

    if (unitOfMeasure) {
      request.item.unitOfMeasure = unitOfMeasure
    }
  }

  if (tags) {
    request.item.tags = request.item.tags.filter((value, index, array) => {
      return array.indexOf(value) === index
    })

    if (request.item.tags.length > 25) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Item Tags can't be more than 25!`
      }
    }
  }

  if (attributes) {
    if (request.item.attributes.length > 10) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Item Attributes can't be more than 10!`
      }
    }
  }

  if (vendorId && request.user.role === 'admin') {
    request.item.vendorId = vendorId
  } else if (request.user._id && request.user.role !== 'admin') {
    request.item.vendorId = request.user._id
  }

  if (name) {
    request.item.name = name
  }

  if (minOrderQuantity) {
    request.item.minOrderQuantity = minOrderQuantity
  }
  if (maxOrderQuantity) {
    request.item.maxOrderQuantity = maxOrderQuantity
  }

  if (description) {
    request.item.description = description
  }

  if (priceSlabs) {
    request.item.priceSlabs = priceSlabs
  }

  if (completionDays) {
    request.item.completionDays = completionDays
  }

  if (vendorPayoutPercentage) {
    request.item.vendorPayoutPercentage = vendorPayoutPercentage
  }

  if (shipmentCosts) {
    request.item.shipmentCosts = shipmentCosts
  }

  request.item = {
    ...request.item,
    updatedBy: request.user._id
  }

  next()
}

export default ItemPrepare