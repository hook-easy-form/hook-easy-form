import { FormArray, DefaultValues } from '../types';

export const setDefaultValues = (
  array: FormArray,
  object?: DefaultValues,
): FormArray => {
  if (!array || !Array.isArray(array)) {
    return [];
  }

  if (array.length === 0) {
    return [];
  }

  if (!object || Object.keys(object).length === 0) return array;
  return array.map((el) =>
    object[el.name] ? { ...el, value: object[el.name] } : el,
  );
};
