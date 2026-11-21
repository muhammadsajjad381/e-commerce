import  mongoose  from 'mongoose'
import app from './app.js'
import { env } from './config/env.js'
// import { logger } from './config/logger.js'
import { connectDB } from './config/db.js'

async function start() {
  await connectDB()

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on http://localhost:${env.PORT} (${env.NODE_ENV})`)
  })

 
  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down`)
    server.close(async () => {
      await mongoose.disconnect()
      process.exit(0)
    })
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start().catch((err) => {
  logger.error({ err }, 'Failed to start server')
  process.exit(1)
})