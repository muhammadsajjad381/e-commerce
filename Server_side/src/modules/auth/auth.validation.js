import { z } from 'zod'

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-z]/, 'Password needs a lower case letter')
  .regex(/[A-Z]/, 'Password needs an upper case letter')
  .regex(/\d/, 'Password needs a number')

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name is too short').max(80),
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    phone: z
      .string()
      .trim()
      .regex(/^03\d{9}$/, 'Enter a valid mobile number (03XXXXXXXXX)')
      .optional(),
    password,
    role: z.enum(['buyer', 'seller']).default('buyer'),
    shopName: z.string().trim().min(2).max(80).optional(),
  })
  .strict()
  .refine((data) => data.role !== 'seller' || Boolean(data.shopName), {
    message: 'Shop name is required for sellers',
    path: ['shopName'],
  })

export const loginSchema = z
  .object({
    email: z.string().trim().toLowerCase().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict()