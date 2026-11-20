import { User } from '../users/user.model.js'
import { RefreshToken } from './refreshToken.model.js'
import { ApiError } from '../../utils/ApiError.js'
import { env } from '../../config/env.js'
import { signAccessToken, generateRefreshToken, hashToken } from '../../utils/tokens.js'

export async function registerUser(data) {
  const exists = await User.exists({ email: data.email })
  if (exists) throw new ApiError(409, 'An account with this email already exists')

  return User.create({
    ...data,
    // Sellers must be approved by an admin before they can list products
    sellerStatus: data.role === 'seller' ? 'pending' : 'none',
  })
}

export async function verifyCredentials(email, password) {
  const user = await User.findOne({ email }).select('+password')

  // One message for both cases so attackers cannot discover which emails exist
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password')
  }
  if (!user.isActive) throw new ApiError(403, 'This account has been disabled')

  return user
}

export async function createSession(user, meta) {
  const refreshToken = generateRefreshToken()

  await RefreshToken.create({
    user: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000),
    userAgent: meta.userAgent,
    ip: meta.ip,
  })

  return { accessToken: signAccessToken(user), refreshToken }
}

// Refresh token rotation: the old token is deleted and a new one is issued
export async function rotateSession(oldToken, meta) {
  if (!oldToken) throw new ApiError(401, 'Not authenticated')

  const stored = await RefreshToken.findOneAndDelete({ tokenHash: hashToken(oldToken) })
  if (!stored || stored.expiresAt < new Date()) {
    throw new ApiError(401, 'Session expired, please log in again')
  }

  const user = await User.findById(stored.user)
  if (!user || !user.isActive) throw new ApiError(401, 'Not authenticated')

  return createSession(user, meta)
}

export async function endSession(token) {
  if (token) await RefreshToken.deleteOne({ tokenHash: hashToken(token) })
}