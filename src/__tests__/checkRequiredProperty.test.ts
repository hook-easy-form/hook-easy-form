import { checkRequiredProperty } from '../lib/utils/checkRequiredProperty';

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
      options: { required: true },
    }));

    expect(checkRequiredProperty(data)).toBe(false);
  });

  it('should return false', () => {
    expect(checkRequiredProperty(mockArray)).toBe(false);
  });
});
