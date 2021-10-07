import {
  FormArray,
  FormObject,
  CheckRequiredProperty,
  CompareValues,
  GetOtherValues,
  Validator,
  HasAnyErrorsInForm,
  CheckFormValid,
  SetDefaultValues,
  SetPropertiesToForm,
} from './types';

export const checkRequiredProperty: CheckRequiredProperty = (currentForm) =>
  currentForm.reduce((acc, el) => {
    if (!el.required || acc) return acc;
    return !(el.required && el.value);
  }, false as boolean);

export const compareValues: CompareValues = (initForm, currentForm) => {
  if (initForm.length === 0) return true;
  return currentForm.reduce((acc, item) => {
    if (!acc) return false;
    const initItem = initForm.find((el) => el.name === item.name);
    if (!initItem) return true;
    return item.value === initItem.value;
  }, true as boolean);
};

export const getOutputObject = <T>(f: FormArray): T => {
  return f.reduce(
    (acc, elem) => ({ ...acc, [elem.name]: elem.value }),
    {} as T,
  );
};

export const getOtherValues: GetOtherValues = (f, exclude) => {
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
    const validateFunc = rules[item as string];
    if (validateFunc && typeof validateFunc === 'function') {
      return validateFunc(value, otherValues);
    }

    return '';
  }, '' as string);
};

export const hasAnyErrorsInForm: HasAnyErrorsInForm = (f, otherValues) => {
  return f.reduce((acc, item) => {
    if (acc) return acc;
    const error = validator(item.value, otherValues, item.validate);
    return error !== '';
  }, false as boolean);
};

export const checkFormValid: CheckFormValid = (f) => {
  return f.reduce((acc, item) => {
    if (!acc) return acc;
    if (item.error) return false;
    return true;
  }, true as boolean);
};

export const setDefaultValues: SetDefaultValues = (array, object) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return [];
  }

  if (!object || Object.keys(object).length === 0) return array;
  return array.map((el) =>
    object[el.name] ? { ...el, value: object[el.name] } : el,
  );
};

export const transformArrayToObject = <U extends string>(
  a: FormArray,
): FormObject<U> => {
  if (!a || !Array.isArray(a) || a.length === 0) return {} as FormObject<U>;
  return a.reduce(
    (acc, item) => ({ ...acc, [item.name]: item }),
    {},
  ) as FormObject<U>;
};

export const setPropertiesToForm: SetPropertiesToForm = (arr) => {
  if (!arr) return [];

  return arr.map((el) => {
    const item = { ...el };

    if (el.required === undefined) item.required = false;
    if (el.onChangeValidate === undefined) item.onChangeValidate = false;
    if (el.options === undefined) item.options = {};
    if (el.validate === undefined) item.validate = {};

    if (el.error === undefined) item.error = '';
    if (el.touched === undefined) item.touched = false;
    return item;
  });
};
