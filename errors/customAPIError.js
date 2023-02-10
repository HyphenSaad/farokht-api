class CustomAPIError extends Error {
  constructor(message) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)

    Error.captureStackTrace(this)
  }
}

export default CustomAPIError