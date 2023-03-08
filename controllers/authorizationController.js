import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { StringValidation } from '../utilities.js'

const Register = async (request, response, next) => {
  const {
    contactName,
    phoneNumber1,
    phoneNumber2,
    landline,
    email,
    password,
    companyName,
    location,
    address,
    paymentMethod,
    bankName,
    bankBranchCode,
    bankAccountNumber,
    role,
    status,
  } = request.body

  StringValidation({
    fieldName: 'User Contact Name',
    data: contactName,
    minLength: 3,
    maxLength: 35,
    isRequired: true,
    regEx: /^[a-zA-Z\s]+$/,
    regExMessage: 'Contact Name should only contain alphabets!'
  })

  StringValidation({
    fieldName: 'User Phone Number 01',
    data: phoneNumber1,
    minLength: 10,
    maxLength: 10,
    isRequired: true,
    regEx: /^[0-9]+$/,
    regExMessage: 'Phone Number 01 should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Phone Number 02',
    data: phoneNumber2,
    minLength: 10,
    maxLength: 10,
    regEx: /^[0-9]+$/,
    regExMessage: 'Phone Number 02 should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Landline Number',
    data: landline,
    minLength: 9,
    maxLength: 11,
    regEx: /^[0-9]+$/,
    regExMessage: 'Landline should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Email Address',
    data: email,
    minLength: 5,
    maxLength: 50,
    isRequired: true,
    // TODO: Find The Proper Email Validation RegEx
    regEx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  })

  StringValidation({
    fieldName: 'User Password',
    data: password,
    minLength: 8,
    maxLength: 32,
    isRequired: true,
    regEx: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
    regExMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special charater and 1 digit!'
  })

  StringValidation({
    fieldName: 'User Role',
    data: role,
    isRequired: true,
    validValues: ['admin', 'vendor', 'retailer'],
  })

  StringValidation({
    fieldName: 'Company Name',
    data: companyName,
    minLength: 3,
    maxLength: 50,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'User Location',
    data: location,
    minLength: 3,
    maxLength: 50,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'User Address',
    data: address,
    minLength: 3,
    maxLength: 50,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'User Payment Method',
    data: paymentMethod,
    minLength: 3,
    maxLength: 50,
    isRequired: true,
  })

  StringValidation({
    fieldName: 'User Bank Name',
    data: bankName,
    minLength: 3,
    maxLength: 50,
    isRequired: true,
    regEx: /^[a-zA-Z\s]+$/,
    regExMessage: 'Bank Name should only contain alphabets!'
  })

  StringValidation({
    fieldName: 'User Bank Branch Code',
    data: bankBranchCode,
    minLength: 4,
    maxLength: 7,
    isRequired: true,
    regEx: /^[0-9]+$/,
    regExMessage: 'Bank Branch Code should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Bank Account Number',
    data: bankAccountNumber,
    minLength: 10,
    maxLength: 15,
    isRequired: true,
    regEx: /^[0-9]+$/,
    regExMessage: 'Bank Account Number should only contain digits!'
  })

  if (request.user) {
    StringValidation({
      fieldName: 'User Account Status',
      data: status,
      isRequired: request.user.role === 'admin',
      validValues: ['pending', 'approved', 'suspended'],
    })
  }

  const isPhoneNumber1Registered = await User.findOne({ phoneNumber1: phoneNumber1.trim() })
  if (isPhoneNumber1Registered) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Phone Number 01 is already registered!'
    }
  }

  if (phoneNumber2) {
    const isPhoneNumber2Registered = await User.findOne({
      phoneNumber2: phoneNumber2.trim()
    })

    if (isPhoneNumber2Registered) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Phone Number 02 is already registered!'
      }
    }

    if (phoneNumber2 && (phoneNumber1.trim() === phoneNumber2.trim())) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Phone Number 1 and 2 can't be same!`
      }
    }
  }

  if (role === 'admin') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid Role for Registration!'
    }
  }

  const payload = {
    contactName,
    phoneNumber1,
    phoneNumber2,
    landline,
    email,
    companyName,
    location,
    address,
    paymentMethod,
    bankName,
    bankBranchCode,
    bankAccountNumber,
    role,
    password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
  }

  if (request.user && request.user.role === 'admin') {
    payload.status = status
    payload.updatedBy = request.user._id
    payload.createdBy = request.user._id
  } else {
    payload.status = 'pending'
    payload.updatedBy = null
    payload.createdBy = null
  }

  if (phoneNumber2 && phoneNumber2.length < 1) {
    payload.phoneNumber2 = undefined
  }

  if (landline && landline.length < 1) {
    payload.landline = undefined
  }

  const user = await User.create(payload)

  const jwtToken = jwt.sign({ userId: user._id, },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })

  user.password = undefined

  response.status(StatusCodes.CREATED).json({
    user: user,
    token: jwtToken,
  })
}

const Login = async (request, response, next) => {
  const { phoneNumber, password, role } = request.body

  StringValidation({
    fieldName: 'Phone Number',
    data: phoneNumber,
    minLength: 10,
    maxLength: 10,
    isRequired: true,
    regEx: /^[0-9]+$/,
    regExMessage: 'Phone Number should only contain digits!'
  })

  StringValidation({
    fieldName: 'Password',
    data: password,
    minLength: 8,
    maxLength: 32,
    isRequired: true,
    regEx: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
    regExMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special charater and 1 digit!'
  })

  StringValidation({
    fieldName: 'Role',
    data: role,
    isRequired: true,
    validValues: ['admin', 'vendor', 'retailer'],
  })

  const payload = {
    '$or': [
      { phoneNumber1: phoneNumber },
      { phoneNumber2: phoneNumber }
    ]
  }

  const user = await User.findOne(payload).select('+password')
  if (!user) {
    throw {
      statusCode: StatusCodes.FORBIDDEN,
      message: 'Invalid Login Credentials!'
    }
  }

  const isValidPassword = await user.ComparePassword(password)
  if (!isValidPassword || user.role !== role.toLowerCase()) {
    throw {
      statusCode: StatusCodes.FORBIDDEN,
      message: 'Invalid Login Credentials!'
    }
  }

  user.password = undefined
  user.__v = undefined

  const jwtToken = jwt.sign({ userId: user._id, },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })

  response.status(StatusCodes.OK).json({
    user: user,
    token: jwtToken,
  })
}

const Update = async (request, response, next) => {
  const {
    contactName,
    phoneNumber1,
    phoneNumber2,
    landline,
    email,
    password,
    companyName,
    location,
    address,
    paymentMethod,
    bankName,
    bankBranchCode,
    bankAccountNumber,
    role,
    status,
  } = request.body

  StringValidation({
    fieldName: 'User Contact Name',
    data: contactName,
    minLength: 3,
    maxLength: 35,
    isRequired: false,
    regEx: /^[a-zA-Z\s]+$/,
    regExMessage: 'Contact Name should only contain alphabets!'
  })

  StringValidation({
    fieldName: 'User Phone Number 01',
    data: phoneNumber1,
    minLength: 10,
    maxLength: 10,
    isRequired: false,
    regEx: /^[0-9]+$/,
    regExMessage: 'Phone Number 01 should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Phone Number 02',
    data: phoneNumber2,
    minLength: 10,
    maxLength: 10,
    isRequired: false,
    regEx: /^[0-9]+$/,
    regExMessage: 'Phone Number 02 should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Landline Number',
    data: landline,
    minLength: 9,
    maxLength: 11,
    isRequired: false,
    regEx: /^[0-9]+$/,
    regExMessage: 'Landline should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Email Address',
    data: email,
    minLength: 5,
    maxLength: 50,
    isRequired: false,
    // TODO: Find The Proper Email Validation RegEx
    regEx: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  })

  StringValidation({
    fieldName: 'User Password',
    data: password,
    minLength: 8,
    maxLength: 32,
    isRequired: request.user.role !== 'admin',
    regEx: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
    regExMessage: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special charater and 1 digit!'
  })

  StringValidation({
    fieldName: 'User Role',
    data: role,
    isRequired: false,
    validValues: ['admin', 'vendor', 'retailer'],
  })

  StringValidation({
    fieldName: 'Company Name',
    data: companyName,
    minLength: 3,
    maxLength: 50,
    isRequired: false,
  })

  StringValidation({
    fieldName: 'User Location',
    data: location,
    minLength: 3,
    maxLength: 50,
    isRequired: false,
  })

  StringValidation({
    fieldName: 'User Address',
    data: address,
    minLength: 3,
    maxLength: 50,
    isRequired: false,
  })

  StringValidation({
    fieldName: 'User Payment Method',
    data: paymentMethod,
    minLength: 3,
    maxLength: 50,
    isRequired: false,
  })

  StringValidation({
    fieldName: 'User Bank Name',
    data: bankName,
    minLength: 3,
    maxLength: 50,
    isRequired: false,
    regEx: /^[a-zA-Z\s]+$/,
    regExMessage: 'Bank Name should only contain alphabets!'
  })

  StringValidation({
    fieldName: 'User Bank Branch Code',
    data: bankBranchCode,
    minLength: 4,
    maxLength: 7,
    isRequired: false,
    regEx: /^[0-9]+$/,
    regExMessage: 'Bank Branch Code should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Bank Account Number',
    data: bankAccountNumber,
    minLength: 10,
    maxLength: 15,
    isRequired: false,
    regEx: /^[0-9]+$/,
    regExMessage: 'Bank Account Number should only contain digits!'
  })

  StringValidation({
    fieldName: 'User Account Status',
    data: status,
    isRequired: false,
    validValues: ['pending', 'approved', 'suspended'],
  })

  if (role === 'admin' && request.user.role !== 'admin') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid Role for Registration!'
    }
  }

  if (phoneNumber2 && (phoneNumber1.trim() === phoneNumber2.trim())) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `Phone Number 1 and 2 can't be same!`
    }
  }

  const payload = {
    _id: request.user.role === 'admin'
      ? request.updateUserId
      : request.user.userId
  }

  const user = await User.findOne(payload)
  if (!user) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User Not Found!',
    }
  }

  const userWithPhoneNumber1 = await User.findOne({ phoneNumber1: phoneNumber1.trim() })
  if (userWithPhoneNumber1 && userWithPhoneNumber1._id.toString() !== user._id.toString()) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Phone Number 01 is already registered!'
    }
  }

  const userWithPhoneNumber2 = await User.findOne({ phoneNumber2: phoneNumber2.trim() })
  if (userWithPhoneNumber2 && userWithPhoneNumber2._id.toString() !== user._id.toString()) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Phone Number 02 is already registered!'
    }
  }

  if (contactName) {
    user.contactName = contactName
  }

  if (phoneNumber1) {
    user.phoneNumber1 = phoneNumber1
  }

  if (phoneNumber2) {
    user.phoneNumber2 = phoneNumber2 || undefined
  }

  if (landline) {
    user.landline = landline || undefined
  }

  if (email) {
    user.email = email
  }

  if (companyName) {
    user.companyName = companyName
  }

  if (location) {
    user.location = location
  }

  if (address) {
    user.address = address
  }

  if (paymentMethod) {
    user.paymentMethod = paymentMethod
  }

  if (bankName) {
    user.bankName = bankName
  }

  if (bankBranchCode) {
    user.bankBranchCode = bankBranchCode
  }

  if (bankAccountNumber) {
    user.bankAccountNumber = bankAccountNumber
  }

  user.updatedBy = request.user._id

  if (password) {
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10))
  }

  if (request.user.role === 'admin' && user.role) {
    if (user.role === 'vendor' && role === 'admin') {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Vendor can't be an admin!`
      }
    } else if (user.role === 'retatiler' && role === 'admin') {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Retailer can't be an admin!`
      }
    } else if (user.role === 'vendor' && role === 'retailer' && user.items.length > 0) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Vendor with items can't be a retailer!`
      }
    } else {
      user.role = role
    }
  }

  if (request.user.role === 'admin' && status) {
    user.status = status
  }

  await user.save().then(async () => {
    const jwtToken = jwt.sign({ userId: payload._id, },
      process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    })

    user.password = undefined
    user.__v = undefined

    response.status(StatusCodes.OK).json({
      user: user,
      token: jwtToken
    })
  })
}

export { Register, Login, Update }