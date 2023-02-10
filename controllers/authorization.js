import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcryptjs'
import { User } from '../models/index.js'

const Register = async (request, response, next) => {
  const { firstName, lastName, phoneNumber1, phoneNumber2, landline,
    email, password, companyName, location, address, paymentMethod,
    bankName, bankBranchCode, bankAccountNumber, role } = request.body

  if (!firstName || !lastName || !phoneNumber1 || !password || !role || !companyName ||
    !location || !address || !paymentMethod || !bankName || !bankBranchCode || !bankAccountNumber)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  // TODO: How about PhoneNumber2 ?
  const userAlreadyExists = await User.findOne({ phoneNumber1 })
  if (userAlreadyExists)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Phone Number Is Already Registered!' }

  if (role === 'admin') throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Role!' }

  if (phoneNumber2 && (phoneNumber1.trim() === phoneNumber2.trim()))
    throw { status: StatusCodes.BAD_REQUEST, message: 'Phone Number 1 and 2 Can\'t Be Same!' }

  try {
    const user = await User.create({
      firstName, lastName, phoneNumber1, phoneNumber2, landline, email, companyName,
      location, address, paymentMethod, bankName, bankBranchCode, bankAccountNumber,
      role, password: await bcrypt.hash(password, await bcrypt.genSalt(10))
    })

    const token = user.CreateJWT()

    response.status(StatusCodes.CREATED).json({
      user: {
        firstName, lastName, phoneNumber1, phoneNumber2: phoneNumber2 || '',
        landline: landline || '', email: email || '', companyName, address,
        paymentMethod, bankName, bankBranchCode, bankAccountNumber, role,
        status: user.status, createdAt: user.createdAt, updatedAt: user.updatedAt
      },
      token
    })
  } catch (error) {
    return next(error)
  }
}

const Login = async (request, response, next) => {
  const { phoneNumber, password, role } = request.body

  if (!phoneNumber || !password || !role)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  const user = await User.findOne({ phoneNumber1: phoneNumber }).select('+password')
  if (!user) throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Login Credentials!' }

  const isValidPassword = await user.ComparePassword(password)
  if (!isValidPassword || user.role !== role.toLowerCase())
    throw { status: StatusCodes.BAD_REQUEST, message: 'Invalid Login Credentials!' }

  const token = user.CreateJWT()
  user.password = ''
  user.__v = undefined
  response.status(StatusCodes.OK).json({ user, token })
}

const Update = async (request, response, next) => {
  const { firstName, lastName, phoneNumber1, phoneNumber2, landline,
    email, password, companyName, location, address, paymentMethod,
    bankName, bankBranchCode, bankAccountNumber, role } = request.body

  if (!firstName || !lastName || !phoneNumber1 || !companyName || !location || !password
    || !address || !paymentMethod || !bankName || !bankBranchCode || !bankAccountNumber)
    throw { status: StatusCodes.BAD_REQUEST, message: 'Please Provide All Values!' }

  if (phoneNumber2 && (phoneNumber1.trim() === phoneNumber2.trim()))
    throw { status: StatusCodes.BAD_REQUEST, message: 'Phone Number 1 and 2 Can\'t Be Same!' }

  const options = {}
  if (request.user.role && request.user.role === 'admin') options._id = request.updateUserId
  else options._id = request.user.userId

  const user = await User.findOne(options)
  if (!user) throw { status: StatusCodes.BAD_REQUEST, message: 'User Not Found!' }

  user.firstName = firstName
  user.lastName = lastName
  user.phoneNumber1 = phoneNumber1
  user.phoneNumber2 = phoneNumber2
  user.landline = landline
  user.email = email
  user.companyName = companyName
  user.location = location
  user.address = address
  user.paymentMethod = paymentMethod
  user.bankName = bankName
  user.bankBranchCode = bankBranchCode
  user.bankAccountNumber = bankAccountNumber
  user.password = await bcrypt.hash(password, await bcrypt.genSalt(10))

  if (request.user.role && request.user.role === 'admin' && role !== 'admin')
    user.role = role

  await user.save().then(() => {
    const token = user.CreateJWT()
    user.password = ''
    user.__v = undefined
    response.status(StatusCodes.OK).json({ user, token })
  }).catch(error => next(error))
}

export { Register, Login, Update }