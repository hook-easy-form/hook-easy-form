type RULES = { [key in string]?: (v: string) => string };

export type OutputData = { [Key in string]: string };

export type Item = {
  name: string;
  value: any;
  type?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  touched?: boolean;
  validate?: RULES;
  options?: any;
};

export type FormArray = Item[];
export type FormObject = { [K in string]: Item };

export type EasyFormTypes = {
  initialForm: Item[];
  resetAfterSubmit?: boolean;
};

export type OnSubmit<T> = (
  data: T,
  event?: React.BaseSyntheticEvent,
) => void | Promise<void>;
