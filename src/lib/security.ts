import Tokens from 'csrf'
import rateLimit from 'express-rate-limit'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const tokens = new Tokens()

// Generate CSRF token
export const generateCsrfToken = () => {
  const secret = tokens.secretSync()
  const token = tokens.create(secret)
  return { secret, token }
}

// Verify CSRF token
export const verifyCsrfToken = (secret: string, token: string) => {
  return tokens.verify(secret, token)
}

// Rate limiting configuration
export const createRateLimiter = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  })
}

// Rate limiting middleware for API routes
export const rateLimitMiddleware = async (request: NextRequest) => {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const limiter = createRateLimiter(15 * 60 * 1000, 5) // 5 requests per 15 minutes

  try {
    await new Promise((resolve, reject) => {
      limiter(
        { ip } as any,
        {
          status: (code: number) => ({
            json: (data: any) => reject({ code, data }),
          }),
        } as any,
        resolve as any
      )
    })
    return null
  } catch (error: any) {
    return NextResponse.json(error.data, { status: error.code })
  }
}
