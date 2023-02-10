class CustomAPIError extends Error {
  constructor(message) {
    super(message)
    Error.captureStackTrace(this, this.constructor)
  }
}

export default CustomAPIError