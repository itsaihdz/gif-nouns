import { NextRequest } from 'next/server'
import { POST, GET } from '../../app/api/upload/route'

// Mock NextRequest
const createMockRequest = (body?: any, headers?: Record<string, string>) => {
  return {
    formData: jest.fn().mockResolvedValue(body),
    headers: new Map(Object.entries(headers || {})),
  } as unknown as NextRequest
}

describe('/api/upload', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('returns ready status', async () => {
      const request = createMockRequest()
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ status: 'ready' })
    })
  })

  describe('POST', () => {
    it('accepts valid PNG file', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      const mockFormData = new FormData()
      mockFormData.append('file', mockFile)

      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.fileName).toBe('test.png')
      expect(data.fileType).toBe('image/png')
    })

    it('accepts valid JPG file', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockFormData = new FormData()
      mockFormData.append('file', mockFile)

      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.fileType).toBe('image/jpeg')
    })

    it('accepts valid SVG file', async () => {
      const mockFile = new File(['test'], 'test.svg', { type: 'image/svg+xml' })
      const mockFormData = new FormData()
      mockFormData.append('file', mockFile)

      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.fileType).toBe('image/svg+xml')
    })

    it('rejects missing file', async () => {
      const mockFormData = new FormData()
      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No file provided')
    })

    it('rejects invalid file type', async () => {
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' })
      const mockFormData = new FormData()
      mockFormData.append('file', mockFile)

      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid file type. Please upload PNG, JPG, or SVG')
    })

    it('rejects oversized file', async () => {
      // Create a file larger than 5MB
      const largeContent = 'x'.repeat(6 * 1024 * 1024) // 6MB
      const mockFile = new File([largeContent], 'large.png', { type: 'image/png' })
      const mockFormData = new FormData()
      mockFormData.append('file', mockFile)

      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('File size must be less than 5MB')
    })

    it('handles server errors gracefully', async () => {
      const mockFormData = new FormData()
      mockFormData.append('file', 'invalid-file')

      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to upload file')
    })

    it('returns proper response structure', async () => {
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      const mockFormData = new FormData()
      mockFormData.append('file', mockFile)

      const request = createMockRequest(mockFormData)
      const response = await POST(request)
      const data = await response.json()

      expect(data).toHaveProperty('success')
      expect(data).toHaveProperty('fileId')
      expect(data).toHaveProperty('fileName')
      expect(data).toHaveProperty('fileSize')
      expect(data).toHaveProperty('fileType')
      expect(data).toHaveProperty('uploadUrl')
      expect(data).toHaveProperty('message')
    })
  })
}) 