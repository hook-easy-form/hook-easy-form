import { renderHook, act } from '@testing-library/react-hooks';

import { useEasyForm } from '../lib/useEasyForm';

const mockArray = [
  {
    name: 'FN',
    value: 'John',
  },
];

const element = {
  name: 'FN',
  value: 'John',
  required: false,
  onChangeValidate: false,
  options: {},
  validate: {},
  error: '',
  isValidField: true,
  touched: false,
};

const expectedMockArray = [element];

const expectedMockObject = {
  FN: element,
};

describe('useEasyForm()', () => {
  it('render simple form', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );
    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('render with empty object', () => {
    const { result } = renderHook(() => useEasyForm({} as any));

    expect(result.current.formArray).toEqual([]);
    expect(result.current.formObject).toEqual({});
  });

  it('render with empty form data', () => {
    const { result } = renderHook(() => useEasyForm({ initialForm: [] }));

    expect(result.current.formArray).toEqual([]);
    expect(result.current.formObject).toEqual({});
  });

  it('submitEvent simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray, resetAfterSubmit: true }),
    );

    const event = {
      preventDefault: () => console.log('preventDefault'),
      persist: () => console.log('persist'),
      target: {},
    };
    const cb = () => {};
    act(() => {
      (result.current.submitEvent(cb) as any)(event as any);
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('submitEvent without event and resetAfterSubmit = false', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray, resetAfterSubmit: false }),
    );

    const cb = () => {};
    act(() => {
      (result.current.submitEvent(cb) as any)(undefined as any);
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('submitEvent simple case with error', () => {
    const rules = {
      required: (v: any) => (v.trim() === '' ? 'Required' : ''),
    };

    const initialForm = mockArray.map((el) => ({
      ...el,
      error: 'required',
      value: '',
      validate: rules,
    }));
    const { result } = renderHook(() =>
      useEasyForm({ initialForm, resetAfterSubmit: true }),
    );

    const f = jest.fn(() => {});
    const event = {
      preventDefault: () => console.log('preventDefault'),
      persist: () => console.log('persist'),
      target: {},
    };

    act(() => {
      (result.current.submitEvent(f) as any)(event as any);
    });

    const array = mockArray.map((el) => ({
      ...el,
      error: 'required',
      isValidField: false,
      validate: rules,
      touched: true,
      value: '',
      required: false,
      onChangeValidate: false,
      options: {},
    }));

    const object = {
      FN: {
        name: 'FN',
        value: '',
        error: 'required',
        validate: rules,
        touched: true,
        isValidField: false,
        required: false,
        onChangeValidate: false,
        options: {},
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('reset func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.resetEvent();
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('reset func with wrong form data', () => {
    const { result } = renderHook(() => useEasyForm({ initialForm: [] }));

    act(() => {
      result.current.resetEvent();
    });

    expect(result.current.formArray).toEqual([]);
    expect(result.current.formObject).toEqual({});
  });

  it('updateEvent func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const params = {
        target: {
          type: 'text',
          value: 'Tony',
          name: 'FN',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.updateEvent(params);
    });

    const array = expectedMockArray.map((e) => ({
      ...e,
      value: 'Tony',
      touched: true,
    }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        value: 'Tony',
        touched: true,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('updateEvent func simple case for type = checkbox', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const params = {
        target: {
          type: 'checkbox',
          checked: true,
          name: 'FN',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.updateEvent(params);
    });

    const array = expectedMockArray.map((e) => ({
      ...e,
      value: true,
      touched: true,
    }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        value: true,
        touched: true,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('updateEvent func simple case with validation', () => {
    const { result } = renderHook(() =>
      useEasyForm({
        initialForm: mockArray.map((e) => ({ ...e, onChangeValidate: true })),
      }),
    );

    act(() => {
      const params = {
        target: {
          type: 'text',
          value: 'Tony',
          name: 'FN',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.updateEvent(params);
    });

    const array = expectedMockArray.map((e) => ({
      ...e,
      value: 'Tony',
      touched: true,
      onChangeValidate: true,
    }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        value: 'Tony',
        touched: true,
        onChangeValidate: true,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('updateEvent func with incorrect name', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const params = {
        target: {
          type: 'text',
          value: 'Tony',
          name: 'FN311',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.updateEvent(params);
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('updateEvent func without params', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.updateEvent();
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('setErrorManually func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setErrorManually('FN', 'Incorrect');
    });

    const array = expectedMockArray.map((e) => ({
      ...e,
      touched: true,
      error: 'Incorrect',
      isValidField: false,
    }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        touched: true,
        error: 'Incorrect',
        isValidField: false,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('setErrorManually func without params', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setErrorManually('');
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('setValueManually func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setValueManually('FN', 'Tony');
    });

    const array = expectedMockArray.map((e) => ({
      ...e,
      value: 'Tony',
      touched: true,
    }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        value: 'Tony',
        touched: true,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('setValueManually func simple case with validation', () => {
    const { result } = renderHook(() =>
      useEasyForm({
        initialForm: mockArray.map((e) => ({ ...e, onChangeValidate: true })),
      }),
    );

    act(() => {
      result.current.setValueManually('FN', 'Tony');
    });

    const array = expectedMockArray.map((e) => ({
      ...e,
      value: 'Tony',
      touched: true,
      onChangeValidate: true,
    }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        value: 'Tony',
        touched: true,
        onChangeValidate: true,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('setValueManually func without params', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setValueManually('');
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('multipleFieldUpdate func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({
        initialForm: [
          {
            name: 'name1',
            value: '',
          },
          {
            name: 'name2',
            value: '',
          },
        ],
      }),
    );

    act(() => {
      result.current.multipleFieldUpdate({ name1: 'John' });
    });

    const object1 = { ...element, name: 'name1', value: 'John' };
    const object2 = { ...element, name: 'name2', value: '' };

    expect(result.current.formArray).toEqual([object1, object2]);
    expect(result.current.formObject).toEqual({
      name1: object1,
      name2: object2,
    });
  });

  it('valid property should be true', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    expect(result.current.valid).toEqual(true);
  });

  it('pristine property should be true', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    expect(result.current.pristine).toEqual(true);
  });

  it('pristine property should be false', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setValueManually('FN', 'some value string');
    });

    expect(result.current.pristine).toEqual(false);
  });

  it('updateDefaultValues function', () => {
    console.log('test')
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    const df = { FN: 'Tony' };

    act(() => {
      result.current.updateDefaultValues(df);
    });

    const array = expectedMockArray.map((e) => ({ ...e, value: df.FN }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        value: df.FN,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('updateDefaultValues function with incorrect data passed', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.updateDefaultValues(undefined as any);
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('updateFormArray function', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    const newArray = [
      {
        name: 'FN',
        value: 'Tony',
      },
    ];

    act(() => {
      result.current._updateFormArray(newArray);
    });

    const array = expectedMockArray.map((e) => ({ ...e, value: 'Tony' }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        value: 'Tony',
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('_updateFormArray function with incorrect data passed', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current._updateFormArray({} as any);
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('runValidate function with incorrect data passed', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.runValidate(undefined as any);
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('runValidate function with correct field passed', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.runValidate('FN');
    });

    const array = expectedMockArray.map((e) => ({
      ...e,
      touched: true,
      isValidField: false,
    }));

    const object = {
      FN: {
        ...expectedMockObject.FN,
        touched: true,
        isValidField: false,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('runValidate function with incorrect field passed', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.runValidate('FN11');
    });

    expect(result.current.formArray).toEqual(expectedMockArray);
    expect(result.current.formObject).toEqual(expectedMockObject);
  });

  it('getProps function with incorrect name passed', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const props = result.current.getProps('bla-bla');
      expect(Object.keys(props)).toEqual(['onChange']);
    });
  });

  it('getProps function with correct name passed', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const props = result.current.getProps('FN');
      expect(Object.keys(props)).toEqual([
        'name',
        'value',
        'onChange',
        'touched',
        'error',
      ]);
    });
  });

  it('getProps function with correct name passed and some extra props', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const props = result.current.getProps('FN', { type: 'number' });
      expect(Object.keys(props)).toEqual([
        'name',
        'value',
        'onChange',
        'touched',
        'error',
        'type',
      ]);
    });
  });

  it('getProps function with correct name passed and only valid Dom elements flag', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const props = result.current.getProps('FN', {}, true);
      expect(Object.keys(props)).toEqual(['name', 'value', 'onChange']);
    });
  });
});
