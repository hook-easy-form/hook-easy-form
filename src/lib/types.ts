export type RULES = { [key in string]?: (v: any, p: OTHER_VALUES) => string };
export type OTHER_VALUES = { [key in string]: any };

export type Item = {
  name: string;
  value?: any;
  options?: { [Key in string]: any };
  error?: string;
  touched?: boolean;
  validate?: RULES;
};

export type FormArray = Item[];
export type FormObject = { [K in string]: Item };
export type DefaultValues = { [K in string]: any };

export type EasyFormTypes = {
  initialForm: Item[];
  resetAfterSubmit?: boolean;
  defaultValues?: DefaultValues;
};

export type OnSubmit<T> = (
  data: (data: T, event?: React.BaseSyntheticEvent) => void | Promise<void>,
  event?: React.BaseSyntheticEvent,
) => ((event: React.FormEvent<HTMLFormElement>) => void) | undefined;

export type ResetEvent = () => void;
export type UpdateEvent = (e?: any) => void;
export type SetErrorManually = (name?: string, error?: string) => void;
export type SetValueManually = (name?: string, value?: string) => void;
export type UpdateDefaultValues = (v: DefaultValues) => void;
export type UpdateFormArray = (array: FormArray) => void;

export type HookType<T, U> = {
  formArray: Item[];
  formObject: U;
  resetEvent: ResetEvent;
  updateEvent: UpdateEvent;
  setErrorManually: SetErrorManually;
  setValueManually: SetValueManually;
  updateDefaultValues: UpdateDefaultValues;
  updateFormArray: UpdateFormArray;
  submitEvent: OnSubmit<T>;
  pristine: boolean;
  valid: boolean;
  disabled: boolean;
};
