import { FormArray } from '../types';

export const checkRequiredProperty = (currentForm: FormArray): boolean =>
  currentForm.reduce((acc, el) => {
    if (!el.options || !el.options.required || acc) return acc;
    return !(el.options.required && el.value);
  }, false as boolean);
