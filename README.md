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

Simple form

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

Simple form with validation and without tag <form>

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

Simple form with default values

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


## Hook props

* __initialForm__ is array of objects (required)

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| name | `string` | `-` | true | Name of input, unique identifier of each field |
| value | `any` | undefined | false | Value for this object |
| error | `string` | ` ` | false | String error |
| touched | `boolean` | false | false | The value indicates whether it has been changed before |
| validate | `object of rules` | undefined | false | Object with functions for validate, function receive two arguments, current value and object with otherValues |
| options | `object` | undefined | false | Object for rest user properties, it can be - type, placeholder, label, some options etc |


* __resetAfterSubmit__

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| resetAfterSubmit | `boolean` | false | false | Property for reset form after success submit |


* __defaultValues__ 

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| defaultValues | `object` | false | false | The values with which to initialize your form |

### Additional

For make `disable` property work, provide `required=true` to options object.  

```js
// Little example of form

const form = [
  {
    name: 'firstName',
    value: '',
    options: {
      type: 'text',
      required: true
    },
  },
  {
    name: 'lastName',
    value: '',
    options: {
      type: 'text',
      required: true
    }
  },
  {
    name: 'age',
    value: '',
    options: {
      type: 'number',
      required: true
    }
  },
];

```



## Hook actions API

```javascript
  formArray // form = array of objects
  formObject // form = object for non iterable cases
  updateEvent // event for onChange 
  resetEvent // reset form manually
  updateDefaultValues // dynamically set default values
  updateFormArray // dynamically set form array
  submitEvent // takes a callback as a param, return to callback formatted object
  setErrorManually // takes a name and error string as a params, and immediately set error for current name
  setValueManually // takes a name and value as a params, and immediately set value for current name
  pristine // true when the current form values are the same as the initialValues, false otherwise.
  valid // true when the form is valid (has no validation errors), false otherwise.
  disabled // boolean, calculated from required properties inside item options object 
```

## Contribute

1. Fork it: `git clone https://github.com/hook-easy-form/hook-easy-form.git`
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Added some feature'`
4. Check the build: `npm run build`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D