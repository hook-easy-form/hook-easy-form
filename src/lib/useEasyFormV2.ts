/* eslint-disable no-useless-constructor */
/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
import { useState, useRef, useCallback, useMemo } from 'react';

import {
  checkRequiredProperty,
  compareValues,
  getOutputObject,
  getOtherValues,
  hasAnyErrorsInForm,
  checkFormValid,
  setDefaultValues,
  // transformArrayToObject,
  validator,
  setPropertiesToForm,
} from './helpers';

import {
  EasyFormTypes,
  // FormArray,
  // FormObject,
  OnSubmit,
  HookType,
  SetValueManually,
  SetErrorManually,
  UpdateEvent,
  UpdateFormArray,
  UpdateDefaultValues,
  Item,
  RunValidate,
} from './types';

// decorators
const autobind = (
  _: any,
  _2: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor => {
  return {
    configurable: true,
    get() {
      return descriptor.value.bind(this);
    },
  };
};

class FormItemBase implements Item {
  name;
  value;
  required;
  onChangeValidate;
  options;
  error;
  touched;
  validate;

  constructor(
    {
      name,
      value,
      required,
      onChangeValidate,
      options = {},
      error,
      touched,
      validate = {},
    }: Item,
    private updateUI: () => void,
  ) {
    this.name = name;
    this.value = value;
    this.required = required === undefined ? false : required;
    this.onChangeValidate =
      onChangeValidate === undefined ? false : onChangeValidate;
    this.options = options;
    this.error = error === undefined ? '' : error;
    this.touched = touched === undefined ? false : touched;
    this.validate = validate;
  }

  getProps(rest?: Record<string, any>, validDomElementsOnly = false) {
    if (validDomElementsOnly) {
      return {
        name: this.name,
        value: this.value,
        onChange: this.onChange,
        ...rest,
      };
    }
    return {
      name: this.name,
      value: this.value,
      error: this.error,
      touched: this.touched,
      onChange: this.onChange,
      ...rest,
    };
  }

  @autobind
  private onChange(e: any): void {
    if (!e || !e.target) return;
    const { value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked : value;

    this.value = v;
    this.touched = true;

    this.updateUI();
  }
}

type FormArray = FormItemBase[];

class FormManager<T extends string> {
  formArray: FormArray;

  constructor(arr: Item[], private updateUI: () => void) {
    this.formArray = arr.map((e) => new FormItemBase(e, updateUI));
  }

  get formObject() {
    return this.formArray.reduce(
      (acc, item) => ({ ...acc, [item.name]: item }),
      {} as Record<T, FormItemBase>,
    );
  }
}

export const useEasyFormV2 = <T extends string>(
  props: EasyFormTypes,
): FormManager<T> => {
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const hookProps = useRef<EasyFormTypes>(props);
  const formManager = useRef<FormManager<T>>(
    new FormManager<T>(hookProps.current.initialForm, forceUpdate),
  );

  return formManager.current;
};
