import mongoose, { Schema } from 'mongoose'
import { User } from './index.js'

const ShipmentCostSchema = new mongoose.Schema({
  source: {
    type: String,
    required: [true, 'Source is required!'],
    minLength: [2, 'Source is too short!'],
    maxLength: [40, 'Source is too long!'],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Destination is required!'],
    minLength: [2, 'Destination is too short!'],
    maxLength: [40, 'Destination is too long!'],
    trim: true,
  },
  days: {
    type: Number,
    required: [true, 'Days are required!'],
    min: [1, 'Days are too short!'],
  },
  maxCost: {
    type: Number,
    required: [true, 'Maximum cost is required!'],
    min: [0, 'Maximum cost is too short!'],
  },
  minCost: {
    type: Number,
    required: [true, 'Minimum cost is required!'],
    min: [0, 'Minimum cost is too short!'],
  },
  status: {
    type: String,
    enum: {
      values: ['disabled', 'enabled'],
      message: '{VALUE} is an invalid status!'
    },
    default: 'enabled',
    lowercase: true,
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

export default mongoose.model('shipmentCost', ShipmentCostSchema)