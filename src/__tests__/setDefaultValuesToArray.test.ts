import { setDefaultValues } from '../lib/helpers';
import { FormArray } from '../lib/types';

describe('setDefaultValues()', () => {
  const mockArray: FormArray<{ FN: string; LN: string }> = [
    {
      name: 'FN',
      value: '',
    },
    {
      name: 'LN',
      value: '',
    },
  ];

  const mockObject = {
    FN: 'John',
    LN: 'Dou',
  };

  it('should return array with default values', () => {
    const outputArray = [
      {
        name: 'FN',
        value: 'John',
      },
      {
        name: 'LN',
        value: 'Dou',
      },
    ];
    expect(setDefaultValues(mockArray, mockObject)).toEqual(outputArray);
  });

  it('should return array without default values', () => {
    expect(setDefaultValues([])).toEqual([]);
    expect(setDefaultValues(mockArray)).toEqual(mockArray);
  });

  it('should return array default array', () => {
    const mockObject = {
      FN23: 'John',
      LN123: 'Dou',
    } as any;
    expect(setDefaultValues(mockArray, mockObject)).toEqual(mockArray);
  });

  it('partial update for fields inside form array', () => {
    const updateObject = {
      FN: 'John',
    };

    const data = setDefaultValues(mockArray, updateObject);

    expect(data).toEqual([
      {
        name: 'FN',
        value: 'John',
      },
      {
        name: 'LN',
        value: '',
      },
    ]);
  });
});
