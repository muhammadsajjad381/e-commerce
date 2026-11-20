import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../modules/users/user.model.js'

export async function authenticate(req, res, next) {
  const header = req.get('authorization')
  const token = req.cookies?.accessToken || (header?.startsWith('Bearer ') ? header.slice(7) : null)

  if (!token) throw new ApiError(401, 'Not authenticated')

  let payload
  try {
    payload = jwt.verify(token, env.JWT_ACCESS_SECRET)
  } catch {
    throw new ApiError(401, 'Invalid or expired token')
  }

  // Load the user fresh on every request so a disabled account is blocked immediately
  const user = await User.findById(payload.sub)
  if (!user || !user.isActive) throw new ApiError(401, 'Not authenticated')

  req.user = user
  next()
}