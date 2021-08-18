import { hasAnyErrorsInForm, checkFormValid } from '../lib/helpers';
import { OTHER_VALUES } from '../lib/types';

const mockArray = [
  {
    name: 'FN',
    value: '',
    validate: {
      required: (v: string, pv: OTHER_VALUES) =>
        v.trim() === '' ? 'Required' : '',
    },
  },
  {
    name: 'LN',
    value: 'Dou',
  },
];

describe('hasErrors.test.ts', () => {
  it('hasAnyErrorsInForm() - should return error = true ', () => {
    expect(hasAnyErrorsInForm(mockArray, {})).toEqual(true);
  });

  it('hasAnyErrorsInForm() - should return error = false', () => {
    const form = mockArray.map((el) =>
      el.name === 'FN' ? { ...el, value: 'John' } : el,
    );
    expect(hasAnyErrorsInForm(form, {})).toEqual(false);
  });

  it('checkFormValid() - should return = true ', () => {
    expect(checkFormValid(mockArray)).toEqual(true);
  });

  it('checkFormValid() - should return = false ', () => {
    const arr = mockArray.map((el) => ({ ...el, error: 'some error string' }));
    expect(checkFormValid(arr)).toEqual(false);
  });
});
