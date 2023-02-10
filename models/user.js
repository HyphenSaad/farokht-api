import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// TODO: Add Unique Constraint On Both Phone Numbers

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required!'],
    minLength: [3, 'First name is too short!'],
    maxLength: [20, 'First name is too long!'],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'First name should only contains alphabets!'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required!'],
    minLength: [3, 'Last name is too short!'],
    maxLength: [20, 'Last name is too long!'],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'Last name should only contains alphabets!'],
  },
  phoneNumber1: {
    type: String,
    required: [true, 'Phone number 1 is required!'],
    minLength: [10, 'Invalid phone number!'],
    maxLength: [10, 'Invalid phone number!'],
    trim: true,
    match: [/^[0-9]+$/, 'Phone number 1 should only contains digits!'],
    unique: true,
  },
  phoneNumber2: {
    type: String,
    minLength: [10, 'Invalid phone number!'],
    maxLength: [10, 'Invalid phone number!'],
    trim: true,
    match: [/^[0-9]+$/, 'Phone number 2 should only contains digits!'],
  },
  landline: {
    type: String,
    minLength: [10, 'Invalid landline number!'], // FIXME: What will be the minimum length of landline?
    maxLength: [10, 'Invalid landline number!'], // FIXME: What will be the maximum length of landline?
    trim: true,
    match: [/^[0-9]+$/, 'Landline number should only contains digits!'],
  },
  email: {
    type: String,
    minLength: [5, 'Email is too short!'],
    maxLength: [50, 'Email is too long!'],
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email!'
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minLength: [8, 'Password is too short!'],
    match: [/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit!'],
    select: false, // TODO: Yeh Kya Karta Hai???
  },
  role: {
    type: String,
    required: [true, 'Role is required!'],
    enum: {
      values: ['admin', 'vendor', 'retailer'],
      message: '{VALUE} is an invalid role!'
    },
    lowercase: true,
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required!'],
    minLength: [3, 'Company name is too short!'], // FIXME: What will be the minimum length of companyName?
    manLength: [50, 'Company name is too long!'], // FIXME: What will be the maximum length of companyName?
    trim: true,
  },
  // FIXME: Why location and address, separately? Is there any difference?
  location: {
    type: String,
    required: [true, 'Location is required!'],
    minLength: [3, 'Location is too short!'], // FIXME: What will be the minimum length of location?
    manLength: [50, 'Location is too long!'], // FIXME: What will be the maximum length of location?
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is required!'],
    minLength: [3, 'Address is too short!'], // FIXME: What will be the minimum length of address?
    manLength: [50, 'Address is too long!'], // FIXME: What will be the maximum length of address?
    trim: true,
  },
  paymentMethod: {
    // FIXME: What is payment method?
    type: String,
    required: [true, 'Payment is required!'],
    minLength: [3, 'Payment is too short!'],
    manLength: [50, 'Payment is too long!'],
    trim: true,
  },
  bankName: {
    type: String,
    required: [true, 'Bank name is required!'],
    minLength: [3, 'Bank name is too short!'], // FIXME: What will be the minimum length of bankName?
    manLength: [50, 'Bank name is too long!'], // FIXME: What will be the maximum length of bankName?
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'Bank name should only contains alphabets!'],
  },
  bankBranchCode: {
    type: String,
    required: [true, 'Bank branch code is required!'],
    minLength: [4, 'Bank branch code is too short!'], // FIXME: What will be the minimum length of bankBranchCode?
    manLength: [7, 'Bank branch code is too long!'],  // FIXME: What will be the maximum length of bankBranchCode?
    trim: true,
    match: [/^[0-9]+$/, 'Bank branch code should only contains digits!'],
  },
  bankAccountNumber: {
    type: String,
    required: [true, 'Bank account number is required!'],
    minLength: [10, 'Bank account number is too short!'], // FIXME: What will be the minimum length of bankAccountNumber?
    manLength: [15, 'Bank account number is too long!'],  // FIXME: What will be the maximum length of bankAccountNumber?
    trim: true,
    match: [/^[0-9]+$/, 'Bank account number should only contains digits!'],
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'approved', 'suspended'],
      message: '{VALUE} is an invalid status!'
    },
    default: 'pending',
    lowercase: true,
  }
}, { timestamps: true })

// UserSchema.index({ phoneNumber2: 1 }, { unique: true, sparse: true })
// UserSchema.index({ landline: 1 }, { unique: true, sparse: true })
// UserSchema.index({ email: 1 }, { unique: true, sparse: true })

// UserSchema.pre('save', async function () {
//   if (!this.isModified('password')) return
//   console.log('password updated')
//   const salt = await bcrypt.genSalt(10)
//   this.password = await bcrypt.hash(this.password, salt)
// })

UserSchema.methods.CreateJWT = function () {
  return jwt.sign(
    { userId: this._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  )
}

UserSchema.methods.ComparePassword = async function (candidatePassword) {
  const isMatched = await bcrypt.compare(candidatePassword, this.password)
  return isMatched
}

export default mongoose.model('user', UserSchema)