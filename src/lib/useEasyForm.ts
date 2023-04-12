import { useState, useRef, useCallback, useMemo, useEffect } from 'react';

import {
  checkRequiredProperty,
  compareValues,
  getOutputObject,
  getOtherValues,
  hasAnyErrorsInForm,
  checkFormValid,
  transformArrayToObject,
  validator,
  setPropertiesToForm,
} from './helpers';

import {
  FormArray,
  OnSubmit,
  HookAPI,
  HookOptions,
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

<<<<<<< Updated upstream
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
=======
/**
 * 
 * @param initialForm FormArray
 * @param values must be wrapped in useMemo for prevent event loop
 * @param options HookOptions
 * @returns HookAPI
 */
export const useEasyForm = <T extends Record<string, unknown>>(
  initialForm: FormArray<T>,
  values?: Partial<T>,
  options?: HookOptions,
): HookAPI<T> => {
  const updatedInitialForm = useRef<FormArray<T>>(setPropertiesToForm(initialForm));

  const [formArray, setFormArray] = useState<FormArray<T>>(updatedInitialForm.current);

  const formObject = useMemo(() => transformArrayToObject<T>(formArray), [formArray]);
  const disabled = useMemo<boolean>(() => checkRequiredProperty<T>(formArray), [formArray]);

  const pristine = useMemo<boolean>(
    () => compareValues(updatedInitialForm.current, formArray),
>>>>>>> Stashed changes
    [formArray],
  );

  const valid = useMemo<boolean>(
    () => !hasAnyErrorsInForm(formArray, getOtherValues(formArray)) && checkFormValid(formArray),
    [formArray],
  );

<<<<<<< Updated upstream
  const updateDefaultValues: UpdateDefaultValues = (v) => {
    if (!v || Object.keys(v).length === 0) return;
    df.current = v;
    setFormArray(setDefaultValues(updatedInitialForm.current, v));
  };

  const multipleFieldUpdate: MultipleFieldUpdate = (fields) => {
    setFormArray((ps) => setDefaultValues(ps, fields));
  };

  const updateFormArray: UpdateFormArray = (array) => {
=======
  const resetEvent: ResetEvent = useCallback(() => {
    setFormArray(updatedInitialForm.current);
  }, []);

  const multipleFieldUpdate: MultipleFieldUpdate<T> = useCallback((fields) => {
    setFormArray((ps) =>
      ps.map((el) => (fields[el.name] ? { ...el, value: fields[el.name] } : el)),
    );
  }, []);

  /**
   * legacy func please use multipleFieldUpdate func instead
   * will be removed in future releases from API
   */
  const updateDefaultValues: UpdateDefaultValues<T> = useCallback(
    (v) => {
      if (!v) resetEvent();
      else multipleFieldUpdate(v);
    },
    [multipleFieldUpdate, resetEvent],
  );

  const updateFormArray: UpdateFormArray<T> = useCallback((array) => {
>>>>>>> Stashed changes
    if (!array || !Array.isArray(array)) return;

    const newInitialForm = setPropertiesToForm(array);
    updatedInitialForm.current = newInitialForm;
    setFormArray(newInitialForm);
  }, []);

<<<<<<< Updated upstream
  const runValidate: RunValidate = (name) => {
=======
  const runValidate: RunValidate<keyof T> = useCallback((name) => {
>>>>>>> Stashed changes
    if (!name) return;

    setFormArray((ps) =>
      ps.map((el) => {
        if (el.name === name) {
          const otherValues = getOtherValues(ps, el.name);
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

<<<<<<< Updated upstream
  const setErrorManually: SetErrorManually = (name, error) => {
=======
  const setErrorManually: SetErrorManually<keyof T> = useCallback((name, error) => {
>>>>>>> Stashed changes
    setFormArray((ps) =>
      ps.map((el) =>
        el.name === name ? { ...el, touched: true, error, isValidField: false } : el,
      ),
    );
  }, []);

<<<<<<< Updated upstream
  const setValueManually: SetValueManually = (name, value) => {
=======
  const setValueManually: SetValueManually<keyof T> = useCallback((name, value) => {
>>>>>>> Stashed changes
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
  }, []);

  // eslint-disable-next-line consistent-return
  const submitEvent: OnSubmit<T> = (callback) => async (e) => {
    if (e) {
      e.preventDefault();
      e.persist();
    }

    const otherValues = getOtherValues(formArray);
    const hasAnyErrorInForm = hasAnyErrorsInForm(formArray, otherValues);
    if (hasAnyErrorInForm) {
      setFormArray(
        formArray.map((el) => {
          const error = el.error || validator(el.value, otherValues, el.validate);
          const isValidField = !error;
          return {
            ...el,
            touched: true,
            error: el.error ? el.error : validator(el.value, otherValues, el.validate),
            isValidField,
          };
        }),
      );
      return;
    }

    const data = getOutputObject<T>(formArray);
    await callback(data, e);
    if (options?.resetAfterSubmit) resetEvent();
  };

<<<<<<< Updated upstream
  const getProps: GetProps = (n, rest, onlyValidDomAttr = false) => {
    const element = formArray.find((e) => e.name === n);
    if (!element) return { onChange: updateEvent, ...rest };
=======
  const getProps: GetProps<T, keyof T> = useCallback(
    (n, rest, onlyValidDomAttr = false) => {
      const element = formArray.find((e) => e.name === n);
      if (!element) return { onChange: updateEvent, ...rest };
>>>>>>> Stashed changes

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
    [formArray, updateEvent],
  );

  useEffect(() => {
    updateDefaultValues(values);
  }, [values, updateDefaultValues]);

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
    submitEvent,
    getProps: getProps,
    pristine,
    valid,
    disabled,
  };
};
