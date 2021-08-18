import { getOutputObject, getOtherValues } from '../lib/helpers';

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

const outputData = { FN: 'John', LN: 'Dou' };

describe('getOutputObject() getOtherValues()', () => {
  it('should return output object getOutputObject', () => {
    expect(getOutputObject(mockArray)).toEqual(outputData);
  });
  it('should return empty object getOutputObject', () => {
    expect(getOutputObject([])).toEqual({});
  });

  it('should return output object getOtherValues', () => {
    expect(getOtherValues(mockArray, 'FN')).toEqual({ LN: 'Dou' });
  });
  it('should return output object getOtherValues', () => {
    expect(getOtherValues(mockArray)).toEqual(outputData);
  });
  it('should return output empty object getOtherValues', () => {
    expect(getOtherValues([])).toEqual({});
  });
});
