import { FormArray, FormObject, Validator, OTHER_VALUES } from './types';

export const checkRequiredProperty = <T>(currentForm: FormArray<T>): boolean =>
  currentForm.reduce((acc, el) => {
    if (!el.required || acc) return acc;
    return !(el.required && el.value);
  }, false as boolean);

export const compareValues = <T>(
  initForm: FormArray<T>,
  currentForm: FormArray<T>,
): boolean => {
  if (initForm.length === 0) return true;
  return currentForm.reduce((acc, item) => {
    if (!acc) return false;
    const initItem = initForm.find((el) => el.name === item.name);
    if (!initItem) return true;
    return item.value === initItem.value;
  }, true as boolean);
};

export const getOutputObject = <T>(f: FormArray<T>): T => {
  return f.reduce(
    (acc, elem) => ({ ...acc, [elem.name]: elem.value }),
    {} as T,
  );
};

export const getOtherValues = <T>(
  f: FormArray<T>,
  exclude?: keyof T,
): OTHER_VALUES => {
  return f.reduce(
    (acc, elem) =>
      elem.name === exclude ? acc : { ...acc, [elem.name]: elem.value },
    {},
  );
};

export const validator: Validator = (value, otherValues, rules) => {
  if (!rules || Object.keys(rules).length === 0) return '';
  return Object.keys(rules).reduce((acc, item) => {
    if (acc) return acc;
    const validateFunc = rules[item];
    if (validateFunc && typeof validateFunc === 'function') {
      return validateFunc(value, otherValues);
    }

    return '';
  }, '' as string);
};

export const hasAnyErrorsInForm = <T>(
  f: FormArray<T>,
  otherValues: OTHER_VALUES,
): boolean => {
  return f.reduce((acc, item) => {
    if (acc) return acc;
    const error = validator(item.value, otherValues, item.validate);
    return error !== '';
  }, false as boolean);
};

export const checkFormValid = <T>(f: FormArray<T>): boolean => {
  return f.reduce((acc, item) => {
    if (!acc) return acc;
    if (item.error) return false;
    return true;
  }, true as boolean);
};

export const multiUpdate = <T>(
  array: FormArray<T>,
  object?: Partial<T>,
): FormArray<T> => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return [];
  }

  if (!object || Object.keys(object).length === 0) return array;
  return array.map((el) =>
    object[el.name] ? { ...el, value: object[el.name] } : el,
  );
};

export const transformArrayToObject = <T>(a: FormArray<T>): FormObject<T> => {
  if (!a || !Array.isArray(a) || a.length === 0) return {} as FormObject<T>;
  return a.reduce(
    (acc, item) => ({ ...acc, [item.name]: item }),
    {},
  ) as FormObject<T>;
};

export const setPropertiesToForm = <T>(arr: FormArray<T>): FormArray<T> => {
  if (!arr) return [];

  return arr.map((el) => {
    const item = { ...el };

    if (el.required === undefined) item.required = false;
    if (el.onChangeValidate === undefined) item.onChangeValidate = false;
    if (el.options === undefined) item.options = {};
    if (el.validate === undefined) item.validate = {};

    if (el.error === undefined) item.error = '';
    if (el.touched === undefined) item.touched = false;
    if (el.isValidField === undefined) item.isValidField = true;
    return item;
  });
};
