import mongoose, { Schema } from 'mongoose'
import { User } from '../index.js'

const AttributeOfItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    minLength: [2, 'Name is too short!'],
    maxLength: [25, 'Name is too long!'],
    trim: true,
    index: {
      unique: true,
      collation: { locale: 'en', strength: 2 }
    }
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

export default mongoose.model('attributeOfItem', AttributeOfItemSchema)