import { beforeEach, describe, expect, it, vi } from 'vitest';
import IntlHelper from '../IntlHelper.js';

const mockT = vi.fn((key, params) => {
  const { v } = params || { v: 0 };
  const translations = {
    days: `${v}d`,
    hours: `${v}h`,
    minutes: `${v}m`,
    seconds: `${v}s`,
    byte: `${v} B`,
    kilobyte: `${v} KB`,
    megabyte: `${v} MB`,
    gigabyte: `${v} GB`,
    terabyte: `${v} TB`,
    perSecond: `{v}/s`,
  };

  // @ts-ignore
  return translations[key] || key;
});

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: mockT,
  }),
}));

beforeEach(() => {
  mockT.mockClear();
});

describe('millisecondsToDHMS', () => {
  it('should convert milliseconds to days, hours, minutes, seconds format', () => {
    const ms = (2 * 86400 + 5 * 3600 + 30 * 60 + 45) * 1000; // 2 days, 5 hours, 30 minutes, 45 seconds
    const result = IntlHelper.millisecondsToDHMS(ms);

    expect(result).toBe('2d 5h');
  });

  it('should handle zero milliseconds', () => {
    const result = IntlHelper.millisecondsToDHMS(0);

    expect(result).toBe('');
  });

  it('should handle milliseconds less than a second', () => {
    const result = IntlHelper.millisecondsToDHMS(500); // 0.5 seconds

    expect(result).toBe('0s');
  });

  it('should respect firstBiggest parameter', () => {
    const ms = (86400 + 2 * 3600 + 30 * 60 + 45) * 1000; // 1 day, 2 hours, 30 minutes, 45 seconds
    const result = IntlHelper.millisecondsToDHMS(ms, 3);

    expect(result).toBe('1d 2h 30m');
  });

  it('should respect custom separator', () => {
    const ms = (3600 + 30 * 60) * 1000; // 1 hour, 30 minutes
    const result = IntlHelper.millisecondsToDHMS(ms, 2, ', ');

    expect(result).toBe('1h, 30m');
  });

  it('should handle only seconds', () => {
    const ms = 45 * 1000; // 45 seconds
    const result = IntlHelper.millisecondsToDHMS(ms);

    expect(result).toBe('45s');
  });
});

describe('dateToHMS', () => {
  it('should convert date to hours, minutes, seconds format', () => {
    const date = new Date(2023, 0, 1, 14, 30, 25); // 14:30:25
    const result = IntlHelper.dateToHMS(date);

    expect(result).toBe('14h 30m');
  });

  it('should handle date with zero minutes and seconds', () => {
    const date = new Date(2023, 0, 1, 14, 0, 0); // 14:00:00
    const result = IntlHelper.dateToHMS(date);

    expect(result).toBe('14h');
  });

  it('should handle date with only minutes', () => {
    const date = new Date(2023, 0, 1, 0, 30, 0); // 00:30:00
    const result = IntlHelper.dateToHMS(date);

    expect(result).toBe('30m');
  });

  it('should handle date with only seconds', () => {
    const date = new Date(2023, 0, 1, 0, 0, 45); // 00:00:45
    const result = IntlHelper.dateToHMS(date);

    expect(result).toBe('45s');
  });

  it('should respect firstBiggest parameter', () => {
    const date = new Date(2023, 0, 1, 14, 30, 25); // 14:30:25
    const result = IntlHelper.dateToHMS(date, 3);

    expect(result).toBe('14h 30m 25s');
  });

  it('should respect custom separator', () => {
    const date = new Date(2023, 0, 1, 14, 30, 0); // 14:30:00
    const result = IntlHelper.dateToHMS(date, 2, ' : ');

    expect(result).toBe('14h : 30m');
  });
});

describe('bytes', () => {
  it('should handle zero bytes', () => {
    const result = IntlHelper.bytes(0);

    expect(result).toBe('0 B');
  });

  it('should convert bytes to appropriate unit', () => {
    const result = IntlHelper.bytes(1024); // 1 KB

    expect(result).toBe('1.00 KB');
  });

  it('should convert large bytes to megabytes', () => {
    const result = IntlHelper.bytes(1024 * 1024 * 5); // 5 MB

    expect(result).toBe('5.00 MB');
  });

  it('should convert very large bytes to gigabytes', () => {
    const result = IntlHelper.bytes(1024 * 1024 * 1024 * 2); // 2 GB

    expect(result).toBe('2.00 GB');
  });

  it('should convert huge bytes to terabytes', () => {
    const result = IntlHelper.bytes(1024 * 1024 * 1024 * 1024 * 1.5); // 1.5 TB

    expect(result).toBe('1.50 TB');
  });

  it('should handle bytes that are not exact powers of 1024', () => {
    const result = IntlHelper.bytes(1500); // ~1.46 KB

    expect(result).toBe('1.46 KB');
  });
});

describe('bytesSpeed', () => {
  it('should format bytes per second', () => {
    const result = IntlHelper.bytesSpeed(1024); // 1 KB/s

    expect(result).toBe('{v}/s');
    expect(mockT).toHaveBeenCalledWith('perSecond', { v: '1.00 KB' });
  });

  it('should handle zero bytes per second', () => {
    IntlHelper.bytesSpeed(0);

    expect(mockT).toHaveBeenCalledWith('perSecond', { v: '0 B' });
  });
});

describe('splitTime', () => {
  it('should handle edge case with small seconds', () => {
    const result = IntlHelper.millisecondsToDHMS(1000); // 1 second

    expect(result).toBe('1s');
  });

  it('should handle exactly one unit', () => {
    const result = IntlHelper.millisecondsToDHMS(3600 * 1000); // 1 hour

    expect(result).toBe('1h');
  });
});
