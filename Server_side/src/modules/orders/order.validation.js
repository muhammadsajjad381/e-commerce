import { z } from 'zod'

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid id')
  .transform((value) => value.toLowerCase())

// Accepts "0300-1234567" or "0300 1234567" and stores 03001234567
const phone = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ''))
  .pipe(z.string().regex(/^03\d{9}$/, 'Enter a valid mobile number (03XXXXXXXXX)'))

// Note there is no price field: the server always reads prices from the database
export const createOrderSchema = z
  .object({
    items: z
      .array(
        z
          .object({
            productId: objectId,
            qty: z.number().int().min(1).max(10),
          })
          .strict()
      )
      .min(1, 'Your order has no items')
      .max(20),
    shippingAddress: z
      .object({
        fullName: z.string().trim().min(2, 'Name is too short').max(80),
        phone,
        city: z.string().trim().min(2, 'Enter your city').max(60),
        address: z.string().trim().min(10, 'Enter your complete address').max(300),
        notes: z.string().trim().max(300).optional(),
      })
      .strict(),
    paymentMethod: z.enum(['cod', 'jazzcash', 'easypaisa', 'card']),
  })
  .strict()

export const statusSchema = z
  .object({ status: z.enum(['shipped', 'delivered', 'cancelled']) })
  .strict()

export const adminListQuerySchema = z.object({
  status: z.enum(['processing', 'shipped', 'delivered', 'cancelled']).optional(),
  q: z.string().trim().max(50).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})