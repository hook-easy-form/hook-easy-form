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
  OnSubmit,
  Hook,
  UpdateFormArray,
  UpdateDefaultValues,
  SetValueManually,
  SetErrorManually,
  RunValidate,
  UpdateEvent,
  ResetEvent,
  GetProps,
  MultipleFieldUpdate,
} from './types';

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
  const updateFormArray: UpdateFormArray<T> = useCallback((array) => {
    if (!array || !Array.isArray(array)) return;

    const newInitialForm = setPropertiesToForm(array);
    updatedInitialForm.current = newInitialForm;
    setFormArray(newInitialForm);
  }, []);

  const runValidate: RunValidate<keyof T> = useCallback((name) => {
    if (!name) return;

    setFormArray((ps) =>
      ps.map((el) => {
        if (el.name === name) {
          const otherValues = getOtherValues<T>(ps, el.name);
          const error = validator(el.value, otherValues, el.validate);
          const isValidField = !!(!error && el.touched);

          return { ...el, error, touched: true, isValidField };
        }
        return el;
      }),
    );
  }, []);

  const updateEvent: UpdateEvent = useCallback((e) => {
    if (!e || !e.target) return;
    const { value, type, checked, name } = e.target;
    const v = type === 'checkbox' ? checked : value;

    setFormArray((ps) => {
      const newForm = ps.map((el) => {
        if (el.name === name) {
          return { ...el, value: v, touched: true };
        }
        return el;
      });

      return newForm.map((el) => {
        if (!el.onChangeValidate) return { ...el, error: '' };

        const otherValues = getOtherValues(newForm, el.name);
        const error = validator(el.value, otherValues, el.validate);
        const isValidField = !!(!error && el.touched);
        return { ...el, error, isValidField };
      });
    });
  }, []);

  const setErrorManually: SetErrorManually<keyof T> = useCallback(
    (name, error) => {
      setFormArray((ps) =>
        ps.map((el) =>
          el.name === name
            ? { ...el, touched: true, error, isValidField: false }
            : el,
        ),
      );
    },
    [],
  );

  const setValueManually: SetValueManually<keyof T> = useCallback(
    (name, value) => {
      setFormArray((ps) => {
        const newForm = ps.map((el) => {
          if (el.name === name) {
            return { ...el, value, touched: true };
          }
          return el;
        });

        return newForm.map((el) => {
          if (!el.onChangeValidate) return { ...el, error: '' };

          const otherValues = getOtherValues(newForm, el.name);
          const error = validator(el.value, otherValues, el.validate);
          const isValidField = !!(!error && el.touched);
          return { ...el, error, isValidField };
        });
      });
    },
    [],
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
          formArray.map((el) => {
            const error =
              el.error || validator(el.value, otherValues, el.validate);
            const isValidField = !error;
            return {
              ...el,
              touched: true,
              error: el.error
                ? el.error
                : validator(el.value, otherValues, el.validate),
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
    [resetEvent, resetAfterSubmit],
  );

  const getProps: GetProps<T, keyof T> = useCallback(
    (n, rest, onlyValidDomAttr = false) => {
      const element = formArray.find((e) => e.name === n);
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
    multipleFieldUpdate: multipleFieldUpdate,
    updateDefaultValues: updateDefaultValues,
    updateFormArray: updateFormArray,
    runValidate: runValidate,
    submitEvent: submitEvent,
    getProps: getProps,
    pristine,
    valid,
    disabled,
  };
};
