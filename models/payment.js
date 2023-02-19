import mongoose, { Schema } from 'mongoose'
import { Order } from './index'

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: Order,
    required: [true, 'Order ID is required!'],
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required!'],
    min: [0, 'Amount is too low!'],
  }
}, { timestamps: true })

export default mongoose.model('payment', PaymentSchema)