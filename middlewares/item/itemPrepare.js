import { Tag, UnitOfMeasure, AttributeOfItem } from '../../models/index.js'
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'

const ItemPrepare = async (request, response, next) => {
  const { name, minOrderNumber, description, userId, tags, attributes, unitOfMeasure,
    pictures, status, priceSlabs } = JSON.parse(request.body.data)

  if (!name || !minOrderNumber || !description || !pictures || !tags || !unitOfMeasure || !attributes || !userId || !priceSlabs)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  if (!Array.isArray(pictures) || !Array.isArray(tags) || !Array.isArray(attributes) || !Array.isArray(priceSlabs))
    throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Request Data-Shape!' }

  const itemTags = []
  if (tags.length < 1) throw { status: StatusCodes.BAD_REQUEST, message: 'Tags are Required!' }
  for (const _tag of tags) {
    const tag = await Tag.findOne({ name: _tag.trim() })
    if (!tag) {
      const object = await Tag.create({ name: _tag.trim() })
      itemTags.push({ _id: object._id, name: object.name })
    }
    else { itemTags.push({ _id: tag._id, name: tag.name }) }
  }

  const itemAttributes = []
  if (attributes.length < 1) throw { status: StatusCodes.BAD_REQUEST, message: 'Attributes are Required!' }
  for (const _attribute of attributes) {
    if (!_attribute.name || !_attribute.value)
      throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Attribute Data-Shape!' }

    const attributeOfItem = await AttributeOfItem.findOne({ name: _attribute.name.trim() })
    if (!attributeOfItem) {
      const object = await AttributeOfItem.create({ name: _attribute.name.trim() })
      itemAttributes.push({ _id: object._id, name: object.name, value: _attribute.value.trim() })
    }
    else { itemAttributes.push({ _id: attributeOfItem._id, name: attributeOfItem.name, value: _attribute.value.trim() }) }
  }

  let itemUnitOfMeasure = await UnitOfMeasure.findOne({ name: unitOfMeasure.trim() })
  if (!itemUnitOfMeasure) {
    const object = await UnitOfMeasure.create({ name: unitOfMeasure.trim() })
    itemUnitOfMeasure = { _id: object._id, name: object.name }
  } else { itemUnitOfMeasure = { _id: itemUnitOfMeasure._id, name: itemUnitOfMeasure.name } }

  // FIXME: Remove Karna Hai, Jab Hum Image Store Finalize Kar Lain Gye!
  const pictureURLs = []
  for (let i = 0; i < 5; ++i)
    pictureURLs.push(`Image ${i + 1} Random ID: ${uuidv4()}`)

  if (priceSlabs.length < 1) throw { status: StatusCodes.BAD_REQUEST, message: 'Price Slabs are Required!' }
  priceSlabs.forEach(priceSlab => {
    if (!priceSlab.slab || !priceSlab.price)
      throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Price Slab Data-Shape!' }
  })

  request.item = {
    name, minOrderNumber, description, userId, tags: itemTags,
    attributes: itemAttributes, unitOfMeasure: itemUnitOfMeasure,
    priceSlabs, pictures: pictureURLs
  }

  if (request.user.role === 'admin')
    if (!status) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Item Status!' }
    else request.item.status = status

  return next()
}

export default ItemPrepare