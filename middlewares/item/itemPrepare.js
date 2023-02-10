// import { BadRequestError } from '../../errors/index.js'
import { Tag, UnitOfMeasure, AttributeOfItem } from '../../models/index.js'
import { v4 as uuidv4 } from 'uuid'
import { StatusCodes } from 'http-status-codes'

const ItemPrepare = async (request, response, next) => {
  const { name, minOrderNumber, description, userId, tags, attributes, unitOfMeasure, pictures, status } = JSON.parse(request.body.data)
  if (!name || !minOrderNumber || !description || !pictures || !tags || !unitOfMeasure || !attributes || !userId)
    // throw new BadRequestError('Please Provide All Values!')
    throw { status: StatusCodes.BAD_REQUEST, message: '' }

  if (!Array.isArray(pictures) || !Array.isArray(tags) || !Array.isArray(attributes))
    // throw new BadRequestError('Invalid Request Data-Shape!')
    throw { status: StatusCodes.BAD_REQUEST, message: '' }

  const itemTags = []
  for (const _tag of tags) {
    const tag = await Tag.findOne({ name: _tag.trim() })
    if (!tag) {
      const object = await Tag.create({ name: _tag.trim() })
      itemTags.push({ _id: object._id, name: object.name })
    }
    else { itemTags.push({ _id: tag._id, name: tag.name }) }
  }

  const itemAttributes = []
  for (const _attribute of attributes) {
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

  request.item = {
    name, minOrderNumber, description, userId, tags: itemTags,
    attributes: itemAttributes, unitOfMeasure: itemUnitOfMeasure,
    pictures: pictureURLs
  }

  if (request.user.role === 'admin')
    if (!status)
      // throw new BadRequestError('Invalid Item Status!')
      throw { status: StatusCodes.BAD_REQUEST, message: '' }
    else request.item.status = status

  return next()
}

export default ItemPrepare