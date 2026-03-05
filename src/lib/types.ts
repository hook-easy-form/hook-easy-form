export type RULES = { [key in string]?: (v: any, p?: OTHER_VALUES) => string };
export type OTHER_VALUES = Record<string, any>;
export type FormItem<T> = {
  name: keyof T;
  value?: any;
  required?: boolean;
  onChangeValidate?: boolean;
  options?: Record<string, any>;
  error?: string;
  touched?: boolean;
  validate?: RULES;
  isValidField?: boolean;
};
export type FormArray<T> = FormItem<T>[];
export type FormObject<T> = { [Property in keyof T]: FormItem<T> };

export type ResetEvent = () => void;
export type RunValidate<K> = (name: K) => void;
export type UpdateEvent = (e?: any) => void;
export type SetErrorManually<K> = (name: K, error?: string) => void;
export type SetValueManually<K> = (name: K, value?: any) => void;
export type SetValue<T, K extends keyof T> = (
  name: K,
  value?: T[K] | ((prevValue: T[K], previousForm: FormObject<T>) => T[K]),
) => FormObject<T>;
export type MultipleFieldUpdate<T> = (v: Partial<T>) => void;
export type UpdateDefaultValues<T> = (v: Partial<T>) => void;
export type UpdateFormArray<T> = (array: FormArray<T>) => void;
export type GetProps<T, K> = (
  name: K,
  rest?: Record<string, any>,
  onlyValidDomAttr?: boolean,
) => Partial<FormItem<T>> & { onChange: UpdateEvent } & Record<string, any>;
export type Validator = (
  value: any,
  otherValues: OTHER_VALUES,
  rules?: RULES,
) => string;

export type EasyFormTypes<T> = {
  initialForm: FormArray<T>;
  resetAfterSubmit?: boolean;
};

export type OnSubmit<T> = (
  data: (data: T, event?: React.BaseSyntheticEvent) => void | Promise<void>,
) => (e: any) => void;

type HookTypes<T> = {
  formArray: FormArray<T>;
  formObject: FormObject<T>;
  pristine: boolean;
  valid: boolean;
  disabled: boolean;
};

type HookMethods<T, K extends keyof T> = {
  resetEvent: ResetEvent;
  updateEvent: UpdateEvent;
  setErrorManually: SetErrorManually<K>;
  setValueManually: SetValueManually<K>;
  setValue: SetValue<T, K>;
  multipleFieldUpdate: MultipleFieldUpdate<T>;
  updateDefaultValues: UpdateDefaultValues<T>;
  _updateFormArray: UpdateFormArray<T>;
  runValidate: RunValidate<K>;
  submitEvent: OnSubmit<T>;
  getProps: GetProps<T, K>;
};

export type Hook<T> = HookMethods<T, keyof T> & HookTypes<T>;
