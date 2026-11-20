import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import pinoHttp from 'pino-http'
import { env } from './config/env.js'
import { logger } from './config/logger.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import authRoutes from './modules/auth/auth.routes.js'

const app = express()

// Needed behind a reverse proxy (Render, Nginx) so rate limiting sees the real client IP
if (env.NODE_ENV === 'production') app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(pinoHttp({ logger }))
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())

app.get('/api/v1/health', (req, res) => {
  const dbReady = mongoose.connection.readyState === 1
  res.status(dbReady ? 200 : 503).json({
    success: dbReady,
    uptime: process.uptime(),
    database: dbReady ? 'connected' : 'disconnected',
  })
})

app.use('/api/v1/auth', authRoutes)

app.use(notFound)
app.use(errorHandler)

export default app