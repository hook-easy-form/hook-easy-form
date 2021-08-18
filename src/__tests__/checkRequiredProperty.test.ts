import { checkRequiredProperty } from '../lib/helpers';

describe('checkRequiredProperty()', () => {
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

  it('should return true', () => {
    const data = mockArray.map((el) => ({
      ...el,
      required: true,
    }));

    expect(checkRequiredProperty(data)).toBe(false);
  });

  it('should return false', () => {
    expect(checkRequiredProperty(mockArray)).toBe(false);
  });
});
