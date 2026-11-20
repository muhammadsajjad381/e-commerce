import mongoose from 'mongoose'
import { env } from '../src/config/env.js'
import { logger } from '../src/config/logger.js'
import { connectDB } from '../src/config/db.js'
import { User } from '../src/modules/users/user.model.js'

if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
  logger.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first')
  process.exit(1)
}

await connectDB()

const existing = await User.findOne({ email: env.ADMIN_EMAIL.toLowerCase() })

if (existing) {
  logger.info('An admin with this email already exists, nothing to do')
} else {
  await User.create({
    name: 'Administrator',
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    role: 'admin',
  })
  logger.info(`Admin created: ${env.ADMIN_EMAIL}`)
}

await mongoose.disconnect()