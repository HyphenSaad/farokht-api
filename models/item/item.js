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
  minOrderQuantity: {
    type: Number,
    required: [true, 'Minimum order quantity is required!'],
    min: [1, 'Minimum order quantity is too short!'],
  },
  maxOrderQuantity: {
    type: Number,
    min: [0, 'Maximum order quantity is too short!'],
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required!'],
    minLength: [10, 'Description is too short!'],
    maxLength: [255, 'Description is too long!'],
    trim: true,
  },
  pictures: {
    type: [{
      type: String,
      trim: true,
    }],
    validate: [notEmpty, 'Pictures are required!'],
  },
  tags: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: Tag,
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
      },
      values: [
        {
          type: String,
          required: [true, 'Attribute value is required!'],
          minLength: [1, 'Attribute value is too short!'],
          maxLength: [50, 'Attribute value is too long!'],
          trim: true,
        }
      ]
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
      location: {
        type: String,
        required: [true, 'Shipment Location is required!'],
        minLength: [2, 'Shipment Location is too short!'],
        maxLength: [75, 'Shipment Location is too long!'],
        trim: true,
      },
      cost: {
        type: Number,
        required: [true, 'Shipment Price is required!'],
        min: [1, 'Shipment Price is too short!'],
      },
      days: {
        type: Number,
        required: [true, 'Shipment Days are required!'],
        min: [1, 'Shipment Days are too short!'],
      }
    }],
    validate: [notEmpty, 'Shipment Cost is required!'],
  },
  // shipmentCosts: {
  //   type: [{
  //     type: Schema.Types.ObjectId,
  //     ref: ShipmentCost,
  //   }],
  //   validate: [notEmpty, 'Shipment Costs are required!'],
  // },
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