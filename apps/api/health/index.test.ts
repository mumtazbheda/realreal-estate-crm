import { describe, it, expect, vi } from 'vitest'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import handler from './index'

describe('/api/health', () => {
  it('should return health check response with correct schema', () => {
    const mockReq = {} as VercelRequest
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as unknown as VercelResponse

    handler(mockReq, mockRes)

    expect(mockRes.status).toHaveBeenCalledWith(200)
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: true,
        time: expect.any(String),
        service: 'realreal-estate-crm-api',
      })
    )
  })

  it('should return ISO timestamp', () => {
    const mockReq = {} as VercelRequest
    let responseData: any

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn((data) => {
        responseData = data
      }),
    } as unknown as VercelResponse

    handler(mockReq, mockRes)

    expect(responseData.time).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})
