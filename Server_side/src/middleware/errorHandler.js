import { env } from '../config/env.js'
import { logger } from '../config/logger.js'
import { ApiError } from '../utils/ApiError.js'

export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}


export function errorHandler(err, req, res, next) {
  if (err.code === 11000) {
    err = new ApiError(409, 'This value is already in use', Object.keys(err.keyValue || {}))
  }

  if (err.type === 'entity.parse.failed') {
    err = new ApiError(400, 'Request body is not valid JSON')
  }

  const status = err.statusCode || 500

  if (status >= 500) logger.error({ err, path: req.originalUrl }, 'Unhandled error')

  res.status(status).json({
    success: false,
    message: status >= 500 && env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    details: err.details,
  })
}