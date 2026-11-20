import { env } from '../../config/env.js'
import {
  registerUser,
  verifyCredentials,
  createSession,
  rotateSession,
  endSession,
} from './auth.service.js'

const isProd = env.NODE_ENV === 'production'

const baseCookie = { httpOnly: true, secure: isProd, sameSite: 'lax' }

const accessCookie = {
  ...baseCookie,
  maxAge: env.ACCESS_TOKEN_TTL_MINUTES * 60 * 1000,
}

// The refresh cookie is only sent to auth endpoints, never to the rest of the API
const refreshCookie = {
  ...baseCookie,
  path: '/api/v1/auth',
  maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
}

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie('accessToken', accessToken, accessCookie)
  res.cookie('refreshToken', refreshToken, refreshCookie)
}

const getMeta = (req) => ({ userAgent: req.get('user-agent'), ip: req.ip })

export const register = async (req, res) => {
  const user = await registerUser(req.body)
  setAuthCookies(res, await createSession(user, getMeta(req)))
  res.status(201).json({ success: true, data: { user } })
}

export const login = async (req, res) => {
  const user = await verifyCredentials(req.body.email, req.body.password)
  setAuthCookies(res, await createSession(user, getMeta(req)))
  res.json({ success: true, data: { user } })
}

export const refresh = async (req, res) => {
  setAuthCookies(res, await rotateSession(req.cookies?.refreshToken, getMeta(req)))
  res.json({ success: true, message: 'Session refreshed' })
}

export const logout = async (req, res) => {
  await endSession(req.cookies?.refreshToken)
  res.clearCookie('accessToken', baseCookie)
  res.clearCookie('refreshToken', { ...baseCookie, path: '/api/v1/auth' })
  res.json({ success: true, message: 'Logged out' })
}

export const me = async (req, res) => {
  res.json({ success: true, data: { user: req.user } })
}