## hook-easy-form
![npm](https://img.shields.io/npm/dm/hook-easy-form.svg?label=%E2%8F%ACdownloads&style=for-the-badge)
![npm](https://img.shields.io/npm/v/hook-easy-form.svg?style=for-the-badge)
![NPM](https://img.shields.io/npm/l/hook-easy-form.svg?label=%F0%9F%93%9Clicense&style=for-the-badge)

Simple way to manage your form with custom hook.
Please visit [documentation](https://hook-forms-documentation.leonskottkenedi.vercel.app) for get more information

## Installation

```bash
npm install hook-easy-form
```

## Usage

<details>
  <summary>Simple form</summary>
  
```jsx
import React from 'react';
import easyHook from 'hook-easy-form';

const form = [
  {
    name: 'firstName',
    value: '',
    options: {
      type: 'text',
    },
  },
  {
    name: 'lastName',
    value: '',
    options: {
      type: 'text',
    }
  },
  {
    name: 'age',
    value: '',
    options: {
      type: 'number',
    }
  },
]

const FormComponent = () => {
  const { formArray, updateEvent, resetEvent, submitEvent, pristine } = easyHook({ initialForm: form });
  const submit = (v) => console.log(v);

  return <form onSubmit={submitEvent(submit)}>
    {formArray.map(el => <input
      key={el.name} 
      name={el.name}
      type={el.options.type} 
      value={el.value}
      onChange={updateEvent}
      />
    )}
    <button onClick={resetEvent} disabled={pristine}>reset</button>
    <button type="submit" disabled={pristine}>submit</button>
  </form>
}
```
</details>

<details>
  <summary>Simple form with validation and without tag <b>form</b> </summary>

  ```jsx
import React from 'react';
import easyHook from 'hook-easy-form';

const form = [
  {
    name: 'firstName',
    value: '',
    options: {
      type: 'text',
    },
    validate: {
      required: v => v.trim() === '' ? 'Required' : '',
    }
  },
  {
    name: 'lastName',
    value: '',
    options: {
      type: 'text',
    }
    validate: {
      required: v => v.trim() === '' ? 'Required' : '',
    }
  },
  {
    name: 'age',
    value: '',
    options: {
      type: 'number',
    }
    validate: {
      required: v => v.trim() === '' ? 'Required' : '',
      availableAge: v => v > 0 && v < 100 ? '' : 'Invalid'
    }
  },
]

const FormComponent = () => {
  const { formArray, updateEvent, resetEvent, submitEvent, pristine } = easyHook({ initialForm: form });
  const submit = (v) => console.log(v);
  
  return <div>
    {formArray.map(el => <div>
      <input
        key={el.name} 
        name={el.name}
        type={el.options.type} 
        value={el.value}
        onChange={updateEvent}
      />
      {el.touched && el.error && <span>{el.error}</span>}
    </div>
    )}
    <button onClick={resetEvent} disabled={pristine}>reset</button>
    <button onClick={submitEvent(submit)} disabled={pristine}>submit</button>
  </div>
}
```
</details>

<details>
  <summary>Simple form with default values</summary>

```jsx
import React from 'react';
import easyHook from 'hook-easy-form';

const sayHelloForm = [
  {
    name: 'firstName',
    value: '',
    options: {
      type: 'text',
      placeholder: 'FirstName',
    },
  },
  {
    name: 'lastName',
    value: '',
    options: {
      type: 'text',
      placeholder: 'LastName',
    },
  },
];

const FormComponent = () => {
  const {
    formArray,
    submitEvent,
    updateEvent,
    resetEvent,
    pristine
  } = MyEasyForm({
    initialForm: sayHelloForm,
    defaultValues: { firstName: 'Tony,', lastName: 'Stark' }
  });

  const submit = v => console.log(v)
  return (
    <form onSubmit={submitEvent(submit)}>
      {formArray.map((el) => (
        <input
          key={el.name}
          name={el.name}
          type={el.options ? el.options.type : 'text'}
          placeholder={el.options ? el.options.placeholder : ''}
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
  )
}

```
</details>

<details>
  <summary>Simple typescript example </summary>


  ```jsx
  import { FN } from 'react';
  import easyHook from 'hook-easy-form';


  type FormData = {
    firstName: string;
    lastName: string;
  };

  type Objects = 'firstName' | 'lastName';

  const Component: FN = () => {

    const { formObject, submitEvent, disabled, valid, runValidate, getProps } =
      useEasyForm<FormData, Objects>({
        initialForm: [
          {
            name: 'firstName',
            value: '',
            required: true,
            options: {
              type: 'text',
            },
          },
          {
            name: 'lastName',
            value: '',
            required: true,
            options: {
              type: 'text',
            },
          },
        ],
      });

    const { firstName, lastName } = formObject;

    const onSubmit = submitEvent((d) => console.log('d', d));

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) =>
      runValidate(e.target.name);

    return (
      <div>
        <form onSubmit={onSubmit}>
          <input
            {...getProps(firstName.name, { type: firstName.options?.type })}
            onBlur={onBlur}
          />
          <input
            {...getProps(lastName.name, { type: lastName.options?.type })}
            onBlur={onBlur}
          />

          <button
            type="submit"
            disabled={disabled || !valid}
          >
            submit
          </button>
        </form>
      </div>
    );
  };
  ```
</details>


## Hook props

* __initialForm__ is array of objects (required)

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| name | `string` | `-` | true | Name of input, unique identifier of each field |
| value | `any` | undefined | false | Value for this object |
| error | `string` | ` ` | false | String error |
| touched | `boolean` | false | false | The value indicates whether it has been changed before |
| isValidField | `boolean` | true | false | a boolean value which mean the field it was touched and doesn't have any validation errors |
| validate | `object of rules` | {} | false | Object with functions for validate, function receive two arguments, current value and object with otherValues |
| required | `boolean` | false | false | This field will be track inside `disabled` property |
| onChangeValidate | `boolean` | false | false | Should validate this field each time when it change? |
| options | `object` | {} | false | Object for rest user properties, it can be - type, placeholder, label, some options etc |


* __resetAfterSubmit__

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| resetAfterSubmit | `boolean` | false | false | Property for reset form after success submit |


* __defaultValues__ 

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| defaultValues | `object` | false | false | The values with which to initialize your form |


## Hook actions API

```javascript
  formArray // form = array of objects
  formObject // form = object for non iterable cases
  updateEvent // event for onChange 
  resetEvent // reset form manually
  updateDefaultValues // dynamically set default values
  updateFormArray // dynamically set form array
  multipleFieldUpdate // update multiple values func 
  submitEvent // takes a callback as a param, return to callback formatted object
  setErrorManually // takes a name and error string as a params, and immediately set error for current name
  setValueManually // takes a name and value as a params, and immediately set value for current name
  pristine // true when the current form values are the same as the initialValues, false otherwise.
  valid // true when the form is valid (has no validation errors), false otherwise.
  disabled // boolean, calculated from required properties
  runValidate // takes a name and runs all validations functions belongs to this field
  getProps // takes a name, some object with params(optional), and boolean value for exclude not valid Dom attr (optional) => returns object with future props for element
```

## Contribute

1. Fork it: `git clone https://github.com/hook-easy-form/hook-easy-form.git`
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Added some feature'`
4. Check the build: `npm run build`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D