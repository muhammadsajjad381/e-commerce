import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { env } from '../config/env.js'

export const signAccessToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.ACCESS_TOKEN_TTL_MINUTES}m`,
  })


export const generateRefreshToken = () => crypto.randomBytes(48).toString('hex')

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex')