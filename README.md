## hook-easy-form

![npm](https://img.shields.io/npm/dm/hook-easy-form.svg?label=%E2%8F%ACdownloads&style=for-the-badge)
![npm](https://img.shields.io/npm/v/hook-easy-form.svg?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/hook-easy-form.svg?label=%F0%9F%93%9Clicense&style=for-the-badge)

`hook-easy-form` is a lightweight React hook to manage form state, validation, and submission with minimal boilerplate.

- 📚 Documentation: [hook-forms-documentation.leonskottkenedi.vercel.app](https://hook-forms-documentation.leonskottkenedi.vercel.app)
- ✅ Works with TypeScript
- ⚡ Good defaults for simple and medium-sized forms

## Installation

```bash
npm install hook-easy-form
```

## Quick start

```tsx
import React from 'react';
import useEasyForm from 'hook-easy-form';

const initialForm = [
  {
    name: 'firstName',
    value: '',
    required: true,
    options: { type: 'text', placeholder: 'First name' },
  },
  {
    name: 'age',
    value: '',
    options: { type: 'number', min: 0 },
  },
];

export const ProfileForm = () => {
  const { formArray, submitEvent, resetEvent, getProps, pristine, valid } =
    useEasyForm({ initialForm });

  const onSubmit = submitEvent((values) => {
    console.log('submitted values', values);
  });

  return (
    <form onSubmit={onSubmit}>
      {formArray.map((field) => (
        <input key={field.name} {...getProps(field.name, field.options)} />
      ))}

      <button type="submit" disabled={!valid}>
        Submit
      </button>
      <button type="button" onClick={resetEvent} disabled={pristine}>
        Reset
      </button>
    </form>
  );
};
```

## Examples

### Basic form

```jsx
import React from 'react';
import useEasyForm from 'hook-easy-form';

const form = [
  { name: 'firstName', value: '', options: { type: 'text' } },
  { name: 'lastName', value: '', options: { type: 'text' } },
  { name: 'age', value: '', options: { type: 'number' } },
];

const FormComponent = () => {
  const { formArray, updateEvent, resetEvent, submitEvent, pristine } =
    useEasyForm({ initialForm: form });

  const submit = (values) => console.log(values);

  return (
    <form onSubmit={submitEvent(submit)}>
      {formArray.map((el) => (
        <input
          key={el.name}
          name={el.name}
          type={el.options.type}
          value={el.value}
          onChange={updateEvent}
        />
      ))}
      <button type="button" onClick={resetEvent} disabled={pristine}>
        Reset
      </button>
      <button type="submit" disabled={pristine}>
        Submit
      </button>
    </form>
  );
};
```

### Validation without a `<form>` element

```jsx
import React from 'react';
import useEasyForm from 'hook-easy-form';

const form = [
  {
    name: 'firstName',
    value: '',
    options: { type: 'text' },
    validate: {
      required: (v) => (v.trim() === '' ? 'Required' : ''),
    },
  },
  {
    name: 'age',
    value: '',
    options: { type: 'number' },
    validate: {
      required: (v) => (v.trim() === '' ? 'Required' : ''),
      availableAge: (v) => (v > 0 && v < 100 ? '' : 'Invalid age'),
    },
  },
];

const FormComponent = () => {
  const { formArray, updateEvent, submitEvent, pristine } =
    useEasyForm({ initialForm: form });

  const submit = (values) => console.log(values);

  return (
    <div>
      {formArray.map((el) => (
        <div key={el.name}>
          <input
            name={el.name}
            type={el.options.type}
            value={el.value}
            onChange={updateEvent}
          />
          {el.touched && el.error && <span>{el.error}</span>}
        </div>
      ))}

      <button type="button" onClick={submitEvent(submit)} disabled={pristine}>
        Submit
      </button>
    </div>
  );
};
```

### Default values

```jsx
import React from 'react';
import useEasyForm from 'hook-easy-form';

const sayHelloForm = [
  {
    name: 'firstName',
    value: '',
    options: { type: 'text', placeholder: 'First name' },
  },
  {
    name: 'lastName',
    value: '',
    options: { type: 'text', placeholder: 'Last name' },
  },
];

const FormComponent = () => {
  const { formArray, submitEvent, updateEvent, resetEvent, pristine } =
    useEasyForm({
      initialForm: sayHelloForm,
      defaultValues: { firstName: 'Tony', lastName: 'Stark' },
    });

  return (
    <form onSubmit={submitEvent((v) => console.log(v))}>
      {formArray.map((el) => (
        <input
          key={el.name}
          name={el.name}
          type={el.options?.type || 'text'}
          placeholder={el.options?.placeholder || ''}
          value={el.value}
          onChange={updateEvent}
        />
      ))}

      <button type="submit" disabled={pristine}>
        Submit
      </button>
      <button type="button" disabled={pristine} onClick={resetEvent}>
        Reset
      </button>
    </form>
  );
};
```

### TypeScript with typed fields

```tsx
import React from 'react';
import useEasyForm from 'hook-easy-form';

type FormData = {
  firstName: string;
  lastName: string;
};

const Component = () => {
  const { formObject, submitEvent, disabled, valid, runValidate, getProps } =
    useEasyForm<FormData>({
      initialForm: [
        {
          name: 'firstName',
          value: '',
          required: true,
          options: { type: 'text' },
        },
        {
          name: 'lastName',
          value: '',
          required: true,
          options: { type: 'text' },
        },
      ],
    });

  const { firstName, lastName } = formObject;

  return (
    <form onSubmit={submitEvent((data) => console.log(data))}>
      <input
        {...getProps('firstName', firstName.options)}
        onBlur={(e) => runValidate(e.target.name)}
      />
      <input
        {...getProps('lastName', lastName.options)}
        onBlur={(e) => runValidate(e.target.name)}
      />

      <button type="submit" disabled={disabled || !valid}>
        Submit
      </button>
    </form>
  );
};
```

## Notes

- Use `submitEvent(callback)` to get a submit handler.
- Use `resetEvent` to go back to the initial/default values.
- Use `runValidate(name)` to trigger field-level validation manually.
