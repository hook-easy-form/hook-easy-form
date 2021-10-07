import { useState, useRef, useCallback, useMemo } from 'react';

import {
  checkRequiredProperty,
  compareValues,
  getOutputObject,
  getOtherValues,
  hasAnyErrorsInForm,
  checkFormValid,
  setDefaultValues,
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
} from './types';

export const useEasyForm = <
  T extends Record<string, unknown>,
  U extends string
>({
  defaultValues,
  initialForm,
  resetAfterSubmit,
}: EasyFormTypes): Hook<T, U> => {
  const df = useRef(defaultValues || {});
  const updatedInitialForm = useRef<FormArray>(
    setPropertiesToForm(initialForm),
  );

  const [formArray, setFormArray] = useState<FormArray>(
    setDefaultValues(updatedInitialForm.current, defaultValues),
  );

  const formObject = useMemo(() => transformArrayToObject<U>(formArray), [
    formArray,
  ]);

  const disabled = useMemo<boolean>(() => checkRequiredProperty(formArray), [
    formArray,
  ]);

  const pristine = useMemo<boolean>(() => {
    return compareValues(
      setDefaultValues(updatedInitialForm.current, df.current),
      formArray,
    );
  }, [formArray]);

  const valid = useMemo<boolean>(
    () =>
      !hasAnyErrorsInForm(formArray, getOtherValues(formArray)) &&
      checkFormValid(formArray),
    [formArray],
  );

  const resetEvent: ResetEvent = () => {
    setFormArray(setDefaultValues(updatedInitialForm.current, df.current));
  };

  const updateDefaultValues: UpdateDefaultValues = (v) => {
    if (!v || Object.keys(v).length === 0) return;
    df.current = v;
    setFormArray(setDefaultValues(updatedInitialForm.current, v));
  };

  const updateFormArray: UpdateFormArray = (array) => {
    if (!array || !Array.isArray(array)) return;

    const newInitialForm = setPropertiesToForm(array);
    updatedInitialForm.current = newInitialForm;
    setFormArray(newInitialForm);
  };

  const runValidate: RunValidate = (name) => {
    if (!name) return;

    setFormArray((ps) =>
      ps.map((el) => {
        if (el.name === name) {
          const otherValues = getOtherValues(ps, el.name);
          const error = validator(el.value, otherValues, el.validate);

          return { ...el, error, touched: true };
        }
        return el;
      }),
    );
  };

  const updateEvent: UpdateEvent = (e) => {
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
        return { ...el, error };
      });
    });
  };

  const setErrorManually: SetErrorManually = (name, error) => {
    setFormArray((ps) =>
      ps.map((el) => (el.name === name ? { ...el, touched: true, error } : el)),
    );
  };

  const setValueManually: SetValueManually = (name, value) => {
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
        return { ...el, error };
      });
    });
  };

  // eslint-disable-next-line consistent-return
  const submitEvent: OnSubmit<T> = (callback) => async (e) => {
    if (e) {
      e.preventDefault();
      e.persist();
    }

    const otherValues = getOtherValues(formArray);
    const hasAnyErrorInForm = hasAnyErrorsInForm(formArray, otherValues);
    if (hasAnyErrorInForm) {
      return setFormArray(
        formArray.map((el) => ({
          ...el,
          touched: true,
          error: el.error
            ? el.error
            : validator(el.value, otherValues, el.validate),
        })),
      );
    }

    const data = getOutputObject<T>(formArray);
    await callback(data, e);
    if (resetAfterSubmit) resetEvent();
  };

  const getProps: GetProps = (n, rest, onlyValidDomAttr = false) => {
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
  };

  return {
    formArray,
    formObject,
    resetEvent: useCallback(resetEvent, []),
    updateEvent: useCallback(updateEvent, []),
    setErrorManually: useCallback(setErrorManually, []),
    setValueManually: useCallback(setValueManually, []),
    updateDefaultValues: useCallback(updateDefaultValues, []),
    updateFormArray: useCallback(updateFormArray, []),
    runValidate: useCallback(runValidate, []),
    submitEvent,
    getProps: useCallback(getProps, [formArray]),
    pristine,
    valid,
    disabled,
  };
};
