import { multiUpdate } from '../lib/helpers';
import { FormArray } from '../lib/types';

describe('multiUpdate()', () => {
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
    expect(multiUpdate(mockArray, mockObject)).toEqual(outputArray);
  });

  it('should return array without default values', () => {
    expect(multiUpdate([])).toEqual([]);
    expect(multiUpdate(mockArray)).toEqual(mockArray);
  });

  it('should return array default array', () => {
    const mockObject = {
      FN23: 'John',
      LN123: 'Dou',
    } as any;
    expect(multiUpdate(mockArray, mockObject)).toEqual(mockArray);
  });

  it('partial update for fields inside form array', () => {
    const updateObject = {
      FN: 'John',
    };

    const data = multiUpdate(mockArray, updateObject);

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
