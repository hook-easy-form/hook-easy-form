import { transformArrayToObject } from '../lib/helpers';

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

const mockObject = {
  FN: {
    name: 'FN',
    value: 'John',
  },
  LN: {
    name: 'LN',
    value: 'Dou',
  },
};

describe('transformArrayToObject()', () => {
  it('should return same object', () => {
    expect(transformArrayToObject(mockArray)).toEqual(mockObject);
  });

  it('should return empty object', () => {
    expect(transformArrayToObject([])).toEqual({});
  });
});
