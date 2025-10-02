import type { VercelRequest, VercelResponse } from '@vercel/node'
import { z } from 'zod'

// Response schema
const HealthResponseSchema = z.object({
  ok: z.boolean(),
  time: z.string(),
  service: z.string(),
})

export type HealthResponse = z.infer<typeof HealthResponseSchema>

export default function handler(req: VercelRequest, res: VercelResponse) {
  const response: HealthResponse = {
    ok: true,
    time: new Date().toISOString(),
    service: 'realreal-estate-crm-api',
  }

  // Validate response schema
  const validated = HealthResponseSchema.parse(response)

  return res.status(200).json(validated)
}
