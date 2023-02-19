import mongoose from 'mongoose'
import { Order } from '../index'

const OrderChatSchema = new mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: Order,
    required: [true, 'Order ID is required!'],
  },
  vendorComment: {
    type: String,
    trim: true,
    min: [1, 'Vendor Comment is too short!']
  },
  retailerComment: {
    type: String,
    trim: true,
    min: [1, 'Vendor Comment is too short!']
  },
  vendorVoiceNote: {
    type: String,
    trim: true,
  },
  retailerVoiceNote: {
    type: String,
    trim: true,
  },
}, { timestamps: true })

export default mongoose.model('orderChat', OrderChatSchema)