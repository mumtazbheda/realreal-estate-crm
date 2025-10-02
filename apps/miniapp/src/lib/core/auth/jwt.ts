import crypto from 'crypto'

export interface JWTPayload {
  uid: string  // user id
  companies: string[]  // company ids user belongs to
  role?: string
  iat: number
  exp: number
}

/**
 * Sign a JWT token (simple implementation without external library)
 */
export function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, secret: string, expiresIn: string = '15m'): string {
  const now = Math.floor(Date.now() / 1000)

  // Parse expiresIn (supports '15m', '7d', '1h', etc.)
  const match = expiresIn.match(/^(\d+)([smhd])$/)
  if (!match) throw new Error('Invalid expiresIn format')

  const [, value, unit] = match
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 }
  const exp = now + (parseInt(value) * multipliers[unit as keyof typeof multipliers])

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp,
  }

  const header = { alg: 'HS256', typ: 'JWT' }

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url')
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url')

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url')

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

/**
 * Verify and decode a JWT token
 */
export function verifyJWT(token: string, secret: string): JWTPayload | null {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.')

    if (!encodedHeader || !encodedPayload || !signature) {
      return null
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url')

    if (signature !== expectedSignature) {
      return null
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString()) as JWTPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) {
      return null
    }

    return payload
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}
