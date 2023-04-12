export type RULES = { [key in string]?: (v: any, p?: OTHER_VALUES) => string };
export type OTHER_VALUES = Record<string, any>;
export type FormItem = {
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
<<<<<<< Updated upstream
export type DefaultValues = Record<string, any>;
=======
>>>>>>> Stashed changes

export type FormArray = FormItem[];
export type FormObject<T extends string> = Record<T, FormItem>;

export type ResetEvent = () => void;
export type RunValidate = (name: string) => void;
export type UpdateEvent = (e?: any) => void;
<<<<<<< Updated upstream
export type SetErrorManually = (name?: string, error?: string) => void;
export type SetValueManually = (name?: string, value?: any) => void;
export type MultipleFieldUpdate = (v: Record<string, any>) => void;
export type UpdateDefaultValues = (v: DefaultValues) => void;
export type UpdateFormArray = (array: FormArray) => void;
export type CheckRequiredProperty = (array: FormArray) => boolean;
export type GetProps = (
  name: string,
=======
export type SetErrorManually<K> = (name: K, error?: string) => void;
export type SetValueManually<K> = (name: K, value?: any) => void;
export type MultipleFieldUpdate<T> = (v: Partial<T>) => void;
export type UpdateDefaultValues<T> = (v?: Partial<T>) => void;
export type UpdateFormArray<T> = (array: FormArray<T>) => void;
export type GetProps<T, K> = (
  name: K,
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
export type EasyFormTypes = {
  initialForm: FormItem[];
  resetAfterSubmit?: boolean;
  defaultValues?: DefaultValues;
};

/**
 * return type is React.FormEvent<HTMLFormElement> | React.MouseEventHandler<HTMLButtonElement>
 */
=======
>>>>>>> Stashed changes
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
  multipleFieldUpdate: MultipleFieldUpdate;
  updateDefaultValues: UpdateDefaultValues;
  updateFormArray: UpdateFormArray;
  runValidate: RunValidate;
  submitEvent: OnSubmit<T>;
  getProps: GetProps;
};

<<<<<<< Updated upstream
export type Hook<T, U extends string> = HookMethods<T> & HookTypes<U>;
=======
export interface HookOptions {
  resetAfterSubmit?: boolean;
}
export type HookAPI<T> = HookMethods<T, keyof T> & HookTypes<T>;
>>>>>>> Stashed changes
