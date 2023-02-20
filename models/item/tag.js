import mongoose, { Schema } from 'mongoose'
import { User } from '../index.js'

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    minLength: [3, 'Name is too short!'],
    maxLength: [25, 'Name is too long!'],
    trim: true,
    unique: true,
    lowercase: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: User
  }
}, { timestamps: true })

export default mongoose.model('tag', TagSchema)