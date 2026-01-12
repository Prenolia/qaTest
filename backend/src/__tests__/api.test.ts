import { describe, it, expect, beforeAll } from 'bun:test'
import { createApp } from '../index'

describe('API Integration Tests', () => {
  const app = createApp()

  describe('GET /', () => {
    it('should return API info', async () => {
      const response = await app.handle(
        new Request('http://localhost/')
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.status).toBe('ok')
      expect(data.message).toBe('QA Testbed API is running')
      expect(data.endpoints).toBeDefined()
    })
  })

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/health')
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.ok).toBe(true)
      expect(data.ts).toBeDefined()
      expect(data.version).toBeDefined()
    })
  })

  describe('GET /api/users', () => {
    it('should return paginated list of users', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users')
      )
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.items).toBeDefined()
      expect(Array.isArray(data.items)).toBe(true)
      expect(data.page).toBeDefined()
      expect(data.pageSize).toBeDefined()
      expect(data.total).toBeDefined()
      expect(data.totalPages).toBeDefined()
    })
  })

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            role: 'User',
          }),
        })
      )
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe('Test User')
      expect(data.data.email).toBe('test@example.com')
      expect(data.data.id).toBeDefined()
    })

    it('should reject invalid email', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test User',
            email: 'invalid-email',
            role: 'User',
          }),
        })
      )

      expect(response.status).toBe(422)
    })

    it('should reject short name', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'A',
            email: 'valid@example.com',
            role: 'User',
          }),
        })
      )

      expect(response.status).toBe(422)
    })
  })

  describe('GET /api/users/:id', () => {
    it('should return 404 for non-existent user', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/users/non-existent-id')
      )

      expect(response.status).toBe(404)
    })
  })

  describe('GET /api/error', () => {
    it('should return an error', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/error')
      )

      expect(response.status).toBe(500)
    })
  })

  describe('GET /api/delay', () => {
    it('should delay response', async () => {
      const start = Date.now()
      const response = await app.handle(
        new Request('http://localhost/api/delay?ms=100')
      )
      const elapsed = Date.now() - start

      expect(response.status).toBe(200)
      expect(elapsed).toBeGreaterThanOrEqual(90)
    })
  })
})
