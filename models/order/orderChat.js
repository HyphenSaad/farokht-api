import mongoose, { Schema } from 'mongoose'
import { Order } from '../index'

const OrderChatSchema = new mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: Order,
    required: [true, 'Order ID is required!'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'User ID is required!'],
  },
  comment: {
    type: String,
    trim: true,
    min: [1, 'Comment is too short!']
  },
  voiceNote: {
    type: String,
    trim: true,
    min: [1, 'Voice Note is too short!']
  },
}, { timestamps: true })

export default mongoose.model('orderChat', OrderChatSchema)