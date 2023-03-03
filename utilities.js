import { StatusCodes } from 'http-status-codes'

export const UpperCaseFirstLetter = (data) => {
  return data.split(' ').map(word => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join(' ')
}

export const StringValidation = ({
  fieldName = '',
  data = '',
  minLength = 0,
  maxLength = 0,
  isRequired = false,
  regEx = undefined,
  regExMessage = undefined,
  validValues = [],
}) => {
  // Check if the data is required and not empty or null
  if (isRequired && (!data || data.trim() === '')) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} is required.`,
    }
  }

  const _data = data.trim()

  // Check if the data length is within the specified range
  if (validValues.length === 0
    && _data
    && (_data.length < minLength || _data.length > maxLength)) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} must be between ${minLength} and ${maxLength} characters long.`,
    }
  }

  // Check if the data matches the specified regular expression (if any)
  if (data && regEx && !regEx.test(data)) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: regExMessage || `${fieldName} is invalid.`,
    }
  }

  // Check if the data is in the valid values array (if any)
  if (isRequired && validValues.length > 0 && !validValues.includes(_data.toLowerCase())) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} must be one of the following values: ${validValues.join(', ')}.`,
    }
  }
}

export const NumberValidation = ({
  fieldName = '',
  data = '',
  minValue = -Infinity,
  maxValue = Infinity,
  isRequired = true,
}) => {
  // Convert the data to a number (if it is given as a string)
  const number = Number(data)

  // Check if the data is required and not empty or null
  if (isRequired && (!data || data.toString().trim() === '')) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} is required.`,
    }
  }

  // Check if the data is a valid number
  if (isNaN(number)) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} must be a number.`,
    }
  }

  // Check if the data value is within the specified range
  if (number < minValue || number > maxValue) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} must be between ${minValue} and ${maxValue}.`,
    }
  }
}

export const ArrayValidation = ({
  fieldName = '',
  data = '',
  isRequired = true,
}) => {
  if (isRequired && !data) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} is required.`,
    }
  }

  if (!Array.isArray(data)) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} must be an array!`,
    }
  }

  if (data.length < 1) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: `${fieldName} is required with at least 1 item!`,
    }
  }
}
