import { useState, useEffect, useCallback } from 'react';

import { validator } from './utils/validator';
import { transformArrayToObject } from './utils/transformArrayToObject';
import { hasAnyErrorsInForm } from './utils/hasErrors';
import { getOutputObject } from './utils/getOutputObject';

import {
  EasyFormTypes,
  FormArray,
  FormObject,
  OnSubmit,
  OutputData,
} from './types';

export const useEasyForm = ({
  initialForm,
  resetAfterSubmit = false,
}: EasyFormTypes) => {
  const [formArray, setFormArray] = useState<FormArray>(initialForm);
  const [formObject, setFormObject] = useState<FormObject>({});

  // transform when init form
  useEffect(() => {
    setFormObject(transformArrayToObject(initialForm));
  }, [initialForm]);

  // transform each time when some property was updated
  useEffect(() => {
    setFormObject(transformArrayToObject(formArray));
  }, [formArray]);

  const resetEvent = () => {
    setFormArray(
      initialForm.map((el) => ({ ...el, value: '', touched: false })),
    );
  };

  const updateEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;

    const { value, type, checked, name } = e.target;

    setFormArray(
      formArray.map((el) =>
        el.name === name
          ? {
              ...el,
              value: type === 'checkbox' ? checked : value,
              touched: true,
              error: validator(value, el.validate),
            }
          : el,
      ),
    );
  };

  const setErrorManually = (name: string, error: string) => {
    setFormArray(
      formArray.map((el) =>
        el.name === name
          ? {
              ...el,
              touched: true,
              error,
            }
          : el,
      ),
    );
  };

  const setValueManually = (name: string, value: any) => {
    setFormArray(
      formArray.map((el) =>
        el.name === name
          ? {
              ...el,
              touched: true,
              value,
              error: validator(value, el.validate),
            }
          : el,
      ),
    );
  };

  const submitEvent = useCallback(
    (callback: OnSubmit<OutputData>) => async (
      e?: React.BaseSyntheticEvent,
    ): Promise<void> => {
      const [hasAnyErrorInForm, newForm] = hasAnyErrorsInForm(formArray);
      if (hasAnyErrorInForm) return setFormArray(newForm);

      const data = getOutputObject(formArray);
      await callback(data, e);
      if (resetAfterSubmit) resetEvent();
    },
    [formArray],
  );

  return {
    formArray,
    formObject,
    resetEvent,
    updateEvent,
    setErrorManually,
    setValueManually,
    submitEvent,
  };
};
