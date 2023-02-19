import mongoose from 'mongoose'
import { User } from '../index'

const AttributeOfItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    minLength: [3, 'Name is too short!'],
    maxLength: [25, 'Name is too long!'],
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: User
  }
}, { timestamps: true })

export default mongoose.model('attributeOfItem', AttributeOfItemSchema)