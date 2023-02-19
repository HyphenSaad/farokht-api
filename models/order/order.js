import mongoose from 'mongoose'
import { User, Item, AttributeOfItem } from '../index'

const OrderSchema = new mongoose.Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'Vendor ID is required!'],
  },
  retailerId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, 'Retailer ID is required!'],
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: Item,
    required: [true, 'Item ID is required!'],
  },
  attributes: {
    type: [{
      _id: { type: Schema.Types.ObjectId, ref: AttributeOfItem, },
      value: {
        type: String,
        required: [true, 'Attribute value is required!'],
        minLength: [3, 'Attribute value is too short!'],
        maxLength: [75, 'Attribute value is too long!'],
        trim: true,
      }
    }],
    validate: [notEmpty, 'Attributes are required!'],
  },
  orderQty: {
    type: Number,
    required: [true, 'Order Qty is required!'],
    min: [1, 'Order Qty is too short!'],
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price Per Unit is required!'],
    min: [1, 'Price Per Unit is too short!'],
  },
  totalPriceForRetailer: {
    type: Number,
    required: [true, 'Total Price for Retailer is required!'],
    min: [0, 'Total Price for Retailer is too short!'],
  },
  totalPayoutForVendor: {
    type: Number,
    required: [true, 'Total Payout for Vendor is required!'],
    min: [0, 'Total Payout for Vendor is too short!'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'delivered'],
      message: '{VALUE} is an invalid status!'
    },
    default: 'pending',
    lowercase: true,
  },
  pickUpType: {
    type: String,
    enum: {
      values: ['pick-up', 'delivery'],
      message: '{VALUE} is an invalid pick-up type!'
    },
    required: [true, 'Pick-Up Type is required!'],
    lowercase: true,
  },
  totalPaidToVendor: {
    type: Number,
    required: [true, 'Total Amount Paid to Vendor is required!'],
    min: [0, 'Total Amount Paid to Vendor is too short!'],
  },
  totalPaidToRetailer: {
    type: Number,
    required: [true, 'Total Amount Paid to Retailer is required!'],
    min: [0, 'Total Amount Paid to Retailer is too short!'],
  },
  orderDate: {
    type: Date,
    required: [true, 'Order Date is required!'],
  },
  finishDate: {
    type: Date,
    required: [true, 'Finish Date is required!'],
  },
  shippingDate: {
    type: Date,
    required: [true, 'Shipping Date is required!'],
  },
  deliverDate: {
    type: Date,
    required: [true, 'Deliver Date is required!'],
  },
}, { timestamps: true })

export default mongoose.model('order', OrderSchema)