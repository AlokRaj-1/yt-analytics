import { describe, it, expect } from 'vitest'
import { fmt, fmtDate, calcEngagement } from './format'

describe('fmt()', () => {
  it('formats millions with 1 decimal', () => {
    expect(fmt(1_000_000)).toBe('1.0M')
    expect(fmt(4_231_890)).toBe('4.2M')
    expect(fmt(10_500_000)).toBe('10.5M')
  })

  it('formats thousands with 1 decimal', () => {
    expect(fmt(1_000)).toBe('1.0K')
    expect(fmt(48_200)).toBe('48.2K')
    expect(fmt(999_999)).toBe('1000.0K')
  })

  it('formats small numbers as plain integers', () => {
    expect(fmt(0)).toBe('0')
    expect(fmt(42)).toBe('42')
    expect(fmt(999)).toBe('999')
  })
})

describe('fmtDate()', () => {
  it('formats ISO date string to short readable format', () => {
    const result = fmtDate('2024-01-05T00:00:00Z')
    expect(result).toContain('Jan')
    expect(result).toContain('5')
  })

  it('handles different months', () => {
    const result = fmtDate('2023-12-25T00:00:00Z')
    expect(result).toContain('Dec')
    expect(result).toContain('25')
  })
})

describe('calcEngagement()', () => {
  it('returns correct engagement rate', () => {
    // (100 + 20) / 1000 * 100 = 12.00
    expect(calcEngagement(1000, 100, 20)).toBe(12.00)
  })

  it('rounds to 2 decimal places', () => {
    // (1 + 1) / 3 * 100 = 66.666... → 66.67
    expect(calcEngagement(3, 1, 1)).toBe(66.67)
  })

  it('returns 0 when views are 0 (no division by zero)', () => {
    expect(calcEngagement(0, 100, 50)).toBe(0)
  })

  it('returns 0 when likes and comments are 0', () => {
    expect(calcEngagement(1000, 0, 0)).toBe(0)
  })
})
