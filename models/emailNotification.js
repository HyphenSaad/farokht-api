import mongoose, { Schema } from 'mongoose'
const notEmpty = (array) => array.length !== 0

const EmailNotificationSchema = new mongoose.Schema({
  action: {
    type: String,
    trim: true,
    required: [true, 'Action is required!'],
  },
  emails: {
    type: [{
      type: String,
      unique: true,
      trim: true,
    }],
    validate: [notEmpty, 'Emails are required!'],
  },
}, { timestamps: true })

export default mongoose.model('emailNotification', EmailNotificationSchema)