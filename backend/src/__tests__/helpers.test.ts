import { describe, it, expect } from 'bun:test'
import {
  generateId,
  getCurrentTimestamp,
  getDateOffset,
  isValidEmail,
  clamp,
  sleep,
  parseIntWithDefault,
  deepClone,
} from '../utils/helpers'

describe('helpers', () => {
  describe('generateId', () => {
    it('should generate a string id', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('should generate unique ids', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('getCurrentTimestamp', () => {
    it('should return ISO timestamp', () => {
      const timestamp = getCurrentTimestamp()
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('getDateOffset', () => {
    it('should return date offset by days', () => {
      const offset = getDateOffset(1)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      expect(new Date(offset).getDate()).toBe(yesterday.getDate())
    })
  })

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.org')).toBe(true)
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true)
    })

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('no spaces@domain.com')).toBe(false)
    })
  })

  describe('clamp', () => {
    it('should clamp value to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0)
    })

    it('should clamp value to max', () => {
      expect(clamp(15, 0, 10)).toBe(10)
    })

    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5)
    })
  })

  describe('sleep', () => {
    it('should delay execution', async () => {
      const start = Date.now()
      await sleep(50)
      const elapsed = Date.now() - start
      expect(elapsed).toBeGreaterThanOrEqual(45)
    })
  })

  describe('parseIntWithDefault', () => {
    it('should parse valid integer string', () => {
      expect(parseIntWithDefault('42', 0)).toBe(42)
    })

    it('should return default for undefined', () => {
      expect(parseIntWithDefault(undefined, 10)).toBe(10)
    })

    it('should return default for invalid string', () => {
      expect(parseIntWithDefault('abc', 5)).toBe(5)
    })
  })

  describe('deepClone', () => {
    it('should create deep copy of object', () => {
      const original = { a: 1, b: { c: 2 } }
      const clone = deepClone(original)

      expect(clone).toEqual(original)
      expect(clone).not.toBe(original)
      expect(clone.b).not.toBe(original.b)
    })

    it('should clone arrays', () => {
      const original = [1, 2, { a: 3 }]
      const clone = deepClone(original)

      expect(clone).toEqual(original)
      expect(clone).not.toBe(original)
    })
  })
})
