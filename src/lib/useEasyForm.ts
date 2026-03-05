import { useState, useRef, useCallback, useMemo } from 'react';

import {
  checkRequiredProperty,
  compareValues,
  getOutputObject,
  getOtherValues,
  hasAnyErrorsInForm,
  checkFormValid,
  multiUpdate,
  transformArrayToObject,
  validator,
  setPropertiesToForm,
} from './helpers';

import {
  EasyFormTypes,
  FormArray,
  FormObject,
  OnSubmit,
  Hook,
  UpdateFormArray,
  UpdateDefaultValues,
  SetValueManually,
  SetValue,
  SetErrorManually,
  RunValidate,
  UpdateEvent,
  ResetEvent,
  GetProps,
  MultipleFieldUpdate,
} from './types';

const updateFieldWithValidation = <T extends Record<string, unknown>>(
  form: FormArray<T>,
  name: keyof T,
  nextValue: any,
): FormArray<T> => {
  if (!name) return form;

  const updatedForm = form.map((filed) => {
    if (filed.name !== name) return filed;
    return { ...filed, value: nextValue, touched: true, error: '' };
  });

  return updatedForm.map((filed) => {
    if (!filed.onChangeValidate) return filed;

    const otherValues = getOtherValues(updatedForm, filed.name);
    const error = validator(filed.value, otherValues, filed.validate);
    const isValidField = !!(!error && filed.touched);
    return { ...filed, error, isValidField };
  });
};

export const useEasyForm = <T extends Record<string, unknown>>({
  initialForm,
  resetAfterSubmit,
}: EasyFormTypes<T>): Hook<T> => {
  const updatedInitialForm = useRef<FormArray<T>>(
    setPropertiesToForm(initialForm),
  );

  const [formArray, setFormArray] = useState<FormArray<T>>(
    updatedInitialForm.current,
  );

  const formObject = useMemo(() => transformArrayToObject<T>(formArray), [
    formArray,
  ]);

  const disabled = useMemo<boolean>(() => checkRequiredProperty<T>(formArray), [
    formArray,
  ]);

  const pristine = useMemo<boolean>(() => {
    return compareValues(updatedInitialForm.current, formArray);
  }, [formArray]);

  const valid = useMemo<boolean>(
    () =>
      !hasAnyErrorsInForm(formArray, getOtherValues(formArray)) &&
      checkFormValid(formArray),
    [formArray],
  );

  const resetEvent: ResetEvent = useCallback(() => {
    setFormArray(updatedInitialForm.current);
  }, []);

  const multipleFieldUpdate: MultipleFieldUpdate<T> = useCallback((fields) => {
    setFormArray((ps) => multiUpdate(ps, fields));
  }, []);

  const updateDefaultValues: UpdateDefaultValues<T> = useCallback(
    (v) => {
      if (!v) resetEvent();
      else multipleFieldUpdate(v);
    },
    [multipleFieldUpdate, resetEvent],
  );

  /**
   * please do not use that function
   * will be removed in future
   */
  const _updateFormArray: UpdateFormArray<T> = useCallback((array) => {
    if (!array || !Array.isArray(array)) return;

    const newInitialForm = setPropertiesToForm(array);
    updatedInitialForm.current = newInitialForm;
    setFormArray(newInitialForm);
  }, []);

  const runValidate: RunValidate<keyof T> = useCallback((name) => {
    if (!name) return;

    setFormArray((ps) =>
      ps.map((filed) => {
        if (filed.name === name) {
          const otherValues = getOtherValues<T>(ps, filed.name);
          const error = validator(filed.value, otherValues, filed.validate);
          const isValidField = !!(!error && filed.touched);

          return { ...filed, error, touched: true, isValidField };
        }
        return filed;
      }),
    );
  }, []);

  const setErrorManually: SetErrorManually<keyof T> = useCallback(
    (name, error) => {
      setFormArray((ps) =>
        ps.map((filed) =>
          filed.name === name
            ? { ...filed, touched: true, error, isValidField: false }
            : filed,
        ),
      );
    },
    [],
  );

  const setValueManually: SetValueManually<keyof T> = useCallback(
    (name, value) => {
      setFormArray((ps) => updateFieldWithValidation(ps, name, value));
    },
    [],
  );

  const setValue: SetValue<T, keyof T> = useCallback(
    (name, nextValue) => {
      let updatedForm: FormArray<T> | null = null;

      setFormArray((ps) => {
        if (!name) {
          updatedForm = ps;
          return ps;
        }

        const previousFormObject = transformArrayToObject<T>(ps);
        const previousField = previousFormObject[name];
        const previousValue = previousField
          ? (previousField.value as T[keyof T])
          : (undefined as T[keyof T]);

        const resolvedValue =
          typeof nextValue === 'function'
            ? (nextValue as (
                prevValue: T[keyof T],
                previousForm: FormObject<T>,
              ) => T[keyof T])(previousValue, previousFormObject)
            : nextValue;

        const newForm = updateFieldWithValidation<T>(ps, name, resolvedValue);
        updatedForm = newForm;
        return newForm;
      });

      return transformArrayToObject<T>(updatedForm ?? formArray);
    },
    [formArray],
  );

  const updateEvent: UpdateEvent = useCallback(
    (e) => {
      if (!e || !e.target) return;
      const { value, type, checked, name } = e.target;
      const v = type === 'checkbox' ? checked : value;

      setValueManually(name, v);
    },
    [setValueManually],
  );

  const submitEvent: OnSubmit<T> = useCallback(
    (callback) => async (e) => {
      if (e) {
        e.preventDefault();
        e.persist();
      }

      const otherValues = getOtherValues(formArray);
      const hasAnyErrorInForm = hasAnyErrorsInForm(formArray, otherValues);
      if (hasAnyErrorInForm) {
        setFormArray(
          formArray.map((filed) => {
            const error =
              filed.error ||
              validator(filed.value, otherValues, filed.validate);
            const isValidField = !error;
            return {
              ...filed,
              touched: true,
              error: filed.error
                ? filed.error
                : validator(filed.value, otherValues, filed.validate),
              isValidField,
            };
          }),
        );
        return;
      }

      const data = getOutputObject<T>(formArray);
      await callback(data, e);
      if (resetAfterSubmit) resetEvent();
    },
    [resetEvent, resetAfterSubmit, formArray],
  );

  const getProps: GetProps<T, keyof T> = useCallback(
    (n, rest, onlyValidDomAttr = false) => {
      const element = formArray.find((filed) => filed.name === n);
      if (!element) return { onChange: updateEvent, ...rest };

      const { name, value, touched, error } = element;

      if (onlyValidDomAttr) {
        return {
          name,
          value,
          onChange: updateEvent,
          ...rest,
        };
      }

      return {
        name,
        value,
        onChange: updateEvent,
        touched,
        error,
        ...rest,
      };
    },
    [updateEvent, formArray],
  );

  return {
    formArray,
    formObject,
    resetEvent: resetEvent,
    updateEvent: updateEvent,
    setErrorManually: setErrorManually,
    setValueManually: setValueManually,
    setValue: setValue,
    multipleFieldUpdate: multipleFieldUpdate,
    updateDefaultValues: updateDefaultValues,
    _updateFormArray: _updateFormArray,
    runValidate: runValidate,
    submitEvent: submitEvent,
    getProps: getProps,
    pristine,
    valid,
    disabled,
  };
};
