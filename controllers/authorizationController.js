import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const Register = async (request, response, next) => {
  const { firstName, lastName, phoneNumber1, phoneNumber2, landline, email, password, companyName,
    location, address, paymentMethod, bankName, bankBranchCode, bankAccountNumber, role } = request.body

  if (!firstName || !lastName || !phoneNumber1 || !email || !password || !role || !companyName ||
    !location || !address || !paymentMethod || !bankName || !bankBranchCode || !bankAccountNumber)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  if (!password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/))
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special charater and 1 digit!' }

  const userAlreadyExists = await User.findOne({ phoneNumber1 })
  if (userAlreadyExists)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Phone Number Is Already Registered!' }

  if (role === 'admin')
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Invalid Role!' }

  if (phoneNumber2 && (phoneNumber1.trim() === phoneNumber2.trim()))
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Phone Number 1 and 2 Can\'t Be Same!' }

  const data = {
    firstName, lastName, phoneNumber1, phoneNumber2, landline, email, companyName, location,
    address, paymentMethod, bankName, bankBranchCode, bankAccountNumber, role,
    password: await bcrypt.hash(password, await bcrypt.genSalt(10))
  }

  if (phoneNumber2.length < 1) data.phoneNumber2 = undefined
  if (landline.length < 1) data.landline = undefined
  if (email.length < 1) data.email = undefined

  try {
    const user = await User.create(data)

    response.status(StatusCodes.CREATED).json({
      user: {
        _id: user._id, firstName, lastName, phoneNumber1, phoneNumber2: phoneNumber2 || '',
        landline: landline || '', email: email || '', companyName, address, paymentMethod,
        bankName, bankBranchCode, bankAccountNumber, role, status: user.status,
        createdAt: user.createdAt, updatedAt: user.updatedAt
      },
      token: jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
    })
  } catch (error) {
    return next(error)
  }
}

const Login = async (request, response, next) => {
  const { phoneNumber, password, role } = request.body

  if (!phoneNumber || !password || !role)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const user = await User.findOne({ phoneNumber1: phoneNumber }).select('+password')
  if (!user)
    throw { statusCode: StatusCodes.FORBIDDEN, message: 'Invalid Login Credentials!' }

  const isValidPassword = await user.ComparePassword(password)
  if (!isValidPassword || user.role !== role.toLowerCase())
    throw { statusCode: StatusCodes.FORBIDDEN, message: 'Invalid Login Credentials!' }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
  user.password = undefined
  user.__v = undefined
  response.status(StatusCodes.OK).json({ user, token })
}

const Update = async (request, response, next) => {
  const { firstName, lastName, phoneNumber1, phoneNumber2, landline, email, password, companyName,
    location, address, paymentMethod, bankName, bankBranchCode, bankAccountNumber, role, status } = request.body

  if (!firstName || !lastName || !phoneNumber1 || !companyName || !location || !email ||
    ((request.user.role && request.user.role !== 'admin') && !password)
    || !address || !paymentMethod || !bankName || !bankBranchCode || !bankAccountNumber)
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  if (request.user.role && request.user.role !== 'admin')
    if (!password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/))
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit!'
      }

  if (phoneNumber2 && (phoneNumber1.trim() === phoneNumber2.trim()))
    throw { statusCode: StatusCodes.BAD_REQUEST, message: 'Phone Number 1 and 2 Can\'t Be Same!' }

  const options = {}
  options._id = (request.user.role && request.user.role === 'admin') ? request.updateUserId : request.user.userId

  const user = await User.findOne(options)
  if (!user)
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'User Not Found!' }

  user.firstName = firstName
  user.lastName = lastName
  user.phoneNumber1 = phoneNumber1
  user.phoneNumber2 = phoneNumber2 || undefined
  user.landline = landline || undefined
  user.email = email
  user.companyName = companyName
  user.location = location
  user.address = address
  user.paymentMethod = paymentMethod
  user.bankName = bankName
  user.bankBranchCode = bankBranchCode
  user.bankAccountNumber = bankAccountNumber

  if (request.user.role && request.user.role !== 'admin')
    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10))

  if (request.user.role && request.user.role === 'admin' && role !== 'admin') {
    user.role = role
    user.status = status
  }

  await user.save().then(async () => {
    const token = jwt.sign({ userId: options._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
    user.password = undefined
    user.__v = undefined
    response.status(StatusCodes.OK).json({ user, token })
  }).catch(error => next(error))
}

export { Register, Login, Update }