type RULES = { [key in string]?: (v: any, p?: OTHER_VALUES) => string };
type OTHER_VALUES = Record<string, any>;
type FormItem = {
  name: string;
  value?: any;
  required?: boolean;
  onChangeValidate?: boolean;
  options?: Record<string, any>;
  error?: string;
  touched?: boolean;
  validate?: RULES;
  isValidField?: boolean;
};
type DefaultValues = Record<string, any>;

export type FormArray = FormItem[];
export type FormObject<T extends string> = Record<T, FormItem>;

export type ResetEvent = () => void;
export type RunValidate = (name: string) => void;
export type UpdateEvent = (e?: any) => void;
export type SetErrorManually = (name?: string, error?: string) => void;
export type SetValueManually = (name?: string, value?: any) => void;
export type UpdateDefaultValues = (v: DefaultValues) => void;
export type UpdateFormArray = (array: FormArray) => void;
export type CheckRequiredProperty = (array: FormArray) => boolean;
export type GetProps = (
  name: string,
  rest?: Record<string, any>,
  onlyValidDomAttr?: boolean,
) => Partial<FormItem> & { onChange: UpdateEvent } & Record<string, any>;
export type CompareValues = (
  initForm: FormArray,
  currentForm: FormArray,
) => boolean;
export type GetOtherValues = (
  array: FormArray,
  exclude?: string,
) => OTHER_VALUES;
export type Validator = (
  value: any,
  otherValues: OTHER_VALUES,
  rules?: RULES,
) => string;
export type HasAnyErrorsInForm = (
  array: FormArray,
  otherValues: OTHER_VALUES,
) => boolean;
export type CheckFormValid = (array: FormArray) => boolean;
export type SetDefaultValues = (
  array: FormArray,
  object?: DefaultValues,
) => FormArray;
export type SetPropertiesToForm = (array: FormArray) => FormArray;

export type EasyFormTypes = {
  initialForm: FormItem[];
  resetAfterSubmit?: boolean;
  defaultValues?: DefaultValues;
};

/**
 * return type is React.FormEvent<HTMLFormElement> | React.MouseEventHandler<HTMLButtonElement>
 */
export type OnSubmit<T> = (
  data: (data: T, event?: React.BaseSyntheticEvent) => void | Promise<void>,
) => (e: any) => void;

type HookTypes<U extends string> = {
  formArray: FormItem[];
  formObject: FormObject<U>;
  pristine: boolean;
  valid: boolean;
  disabled: boolean;
};

type HookMethods<T> = {
  resetEvent: ResetEvent;
  updateEvent: UpdateEvent;
  setErrorManually: SetErrorManually;
  setValueManually: SetValueManually;
  updateDefaultValues: UpdateDefaultValues;
  updateFormArray: UpdateFormArray;
  runValidate: RunValidate;
  submitEvent: OnSubmit<T>;
  getProps: GetProps;
};

export type Hook<T, U extends string> = HookMethods<T> & HookTypes<U>;
