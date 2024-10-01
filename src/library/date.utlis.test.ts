import {
  timestampToDate,
  getCurrentTimestamp,
  isTimestampInPast,
} from './date.utils';

describe('timestampToDate', () => {
  it('should convert a valid timestamp to a Date object', () => {
    const timestamp = 1609459200000; // January 1, 2021
    const date = timestampToDate(timestamp);
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe('2021-01-01T00:00:00.000Z');
  });

  it('should handle a timestamp of zero', () => {
    const timestamp = 0;
    const date = timestampToDate(timestamp);
    expect(date).toBeInstanceOf(Date);
    expect(date.toISOString()).toBe('1970-01-01T00:00:00.000Z');
  });
});

describe('getCurrentTimestamp', () => {
  it('should return a valid timestamp', () => {
    const timestamp = getCurrentTimestamp();
    expect(typeof timestamp).toBe('number');
    expect(timestamp).toBeGreaterThan(0);
  });
});

describe('isTimestampInPast', () => {
  it('should return true for a past timestamp', () => {
    const pastTimestamp = 1609459200000; // January 1, 2021
    expect(isTimestampInPast(pastTimestamp)).toBe(true);
  });

  it('should return false for a future timestamp', () => {
    const futureTimestamp = Date.now() + 10000; // 10 seconds in the future
    expect(isTimestampInPast(futureTimestamp)).toBe(false);
  });

  it('should return false for the current timestamp', () => {
    const currentTimestamp = getCurrentTimestamp();
    expect(isTimestampInPast(currentTimestamp)).toBe(false);
  });
});
