import { getPagination } from './pagination.utils';

describe('getPagination', () => {
  it('should return correct pagination metadata for given totalRecords, skip, and limit', () => {
    const result = getPagination(100, 0, 10);
    expect(result).toEqual({
      totalRecords: 100,
      totalPages: 10,
      currentPage: 1,
      nextPage: 2,
      previousPage: null,
      limit: 10,
      skip: 0,
    });
  });

  it('should adjust skip value if it exceeds total records', () => {
    const result = getPagination(100, 150, 10);
    expect(result.skip).toBe(90);
  });

  it('should return null for nextPage if on the last page', () => {
    const result = getPagination(100, 90, 10);
    expect(result.nextPage).toBeNull();
  });

  it('should return null for previousPage if on the first page', () => {
    const result = getPagination(100, 0, 10);
    expect(result.previousPage).toBeNull();
  });

  it('should handle zero totalRecords correctly', () => {
    const result = getPagination(0, 0, 10);
    expect(result).toEqual({
      totalRecords: 0,
      totalPages: 0,
      currentPage: 1,
      nextPage: null,
      previousPage: null,
      limit: 10,
      skip: 0,
    });
  });

  it('should handle skip value equal to totalRecords correctly', () => {
    const result = getPagination(100, 100, 10);
    expect(result.skip).toBe(90);
  });

  it('should handle limit greater than totalRecords correctly', () => {
    const result = getPagination(50, 0, 100);
    expect(result).toEqual({
      totalRecords: 50,
      totalPages: 1,
      currentPage: 1,
      nextPage: null,
      previousPage: null,
      limit: 100,
      skip: 0,
    });
  });
});
