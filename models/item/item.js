import mongoose, { Schema } from 'mongoose'
import { User, AttributeOfItem, UnitOfMeasure, Tag, ShipmentCost } from '../index.js'

const notEmpty = (array) => array.length !== 0

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    minLength: [3, 'Name is too short!'],
    maxLength: [25, 'Name is too long!'],
    trim: true,
    match: [/^[a-zA-Z0-9-|&\s]+$/, 'Name should only contains alphabets and digits!'],
  },
  minOrderNumber: {
    type: Number,
    required: [true, 'Minimum order number is required!'],
    min: [1, 'Minimum order number is too short!'],
  },
  maxOrderNumber: {
    type: Number,
    min: [0, 'Maximum order number is too short!'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required!'],
    minLength: [10, 'Description is too short!'],
    maxLength: [255, 'Description is too long!'],
    trim: true,
  },
  // pictures: {
  //   type: [{
  //     type: String,
  //     unique: true,
  //     trim: true,
  //   }],
  //   validate: [notEmpty, 'Pictures are required!'],
  // },
  tags: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: Tag,
      unique: true,
    }],
    validate: [notEmpty, 'Tags are required!'],
  },
  unitOfMeasure: {
    type: Schema.Types.ObjectId,
    ref: UnitOfMeasure,
    required: [true, 'Unit of measure is required!'],
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'Vendor ID is required!'],
  },
  attributes: {
    type: [{
      _id: {
        type: Schema.Types.ObjectId,
        ref: AttributeOfItem,
        unique: true,
      },
      value: {
        type: String,
        required: [true, 'Attribute value is required!'],
        minLength: [1, 'Attribute value is too short!'],
        maxLength: [75, 'Attribute value is too long!'],
        trim: true,
      }
    }],
    validate: [notEmpty, 'Attributes are required!'],
  },
  status: {
    type: String,
    enum: {
      values: ['disabled', 'enabled', 'suspended'],
      message: '{VALUE} is an invalid status!'
    },
    default: 'enabled',
    lowercase: true,
  },
  priceSlabs: {
    type: [{
      slab: {
        type: Number,
        required: [true, 'Price slab is required!'],
        min: [1, 'Price slab is too short!'],
      },
      price: {
        type: Number,
        required: [true, 'Price slab is required!'],
        min: [1, 'Price slab is too short!'],
      }
    }],
    validate: [notEmpty, 'Price slabs are required!'],
  },
  vendorPayoutPercentage: {
    type: Number,
    required: [true, 'Vendor Payout Percentage is required!'],
    min: [0, 'Vendor Payout Percentage is too short!'],
  },
  completionDays: {
    type: Number,
    required: [true, 'Completion Days are required!'],
    min: [1, 'Completion Days are too short!'],
  },
  shipmentCosts: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: ShipmentCost,
      unique: true,
    }],
    validate: [notEmpty, 'Shipment Costs are required!'],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'User ID is required!'],
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'User ID is required!'],
  },
}, { timestamps: true })

export default mongoose.model('item', ItemSchema)