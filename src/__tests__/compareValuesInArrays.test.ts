import { compareValues } from '../lib/helpers';

describe('compareValues()', () => {
  const mockArray = [
    {
      name: 'FN',
      value: 'John',
    },
    {
      name: 'LN',
      value: 'Dou',
    },
  ];

  const mockArrayInit = [
    {
      name: 'FN',
      value: 'John',
    },
    {
      name: 'LN',
      value: 'Dou',
    },
  ];

  it('should return true', () => {
    expect(compareValues(mockArrayInit, mockArray)).toBe(true);
    expect(compareValues([], mockArray)).toBe(true);
  });

  it('should return true', () => {
    const mockArray1 = [
      {
        name: 'FN2',
        value: 'John',
      },
      {
        name: 'LN12',
        value: 'Dou',
      },
    ];

    expect(compareValues(mockArrayInit, mockArray1)).toBe(true);
  });

  it('should return false', () => {
    expect(
      compareValues(
        mockArrayInit,
        mockArray.map((el) => ({ ...el, value: 'diff' })),
      ),
    ).toBe(false);
  });
});
