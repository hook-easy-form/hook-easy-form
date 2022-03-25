import { setPropertiesToForm } from '../lib/helpers';

describe('setPropertiesToForm()', () => {
  it('should return exception', () => {
    expect(setPropertiesToForm(undefined as any)).toEqual([]);
  });

  it('should return array with additional data', () => {
    const mockArray = [
      {
        name: 'FN',
        value: 'John',
      },
    ];

    const expectedData = [
      {
        name: 'FN',
        value: 'John',
        required: false,
        onChangeValidate: false,
        options: {},
        validate: {},
        error: '',
        isValidField: true,
        touched: false,
      },
    ];
    expect(setPropertiesToForm(mockArray)).toEqual(expectedData);
  });

  it('should return array with additional data 1', () => {
    const mockArray = [
      {
        name: 'FN',
        value: 'John',
        required: true,
      },
    ];

    const expectedData = [
      {
        name: 'FN',
        value: 'John',
        required: true,
        onChangeValidate: false,
        options: {},
        validate: {},
        error: '',
        isValidField: true,
        touched: false,
      },
    ];
    expect(setPropertiesToForm(mockArray)).toEqual(expectedData);
  });

  it('should return array with additional data 2', () => {
    const mockArray = [
      {
        name: 'FN',
        value: 'John',
        onChangeValidate: true,
      },
    ];

    const expectedData = [
      {
        name: 'FN',
        value: 'John',
        required: false,
        onChangeValidate: true,
        options: {},
        validate: {},
        error: '',
        isValidField: true,
        touched: false,
      },
    ];
    expect(setPropertiesToForm(mockArray)).toEqual(expectedData);
  });

  it('should return array with additional data 3', () => {
    const mockArray = [
      {
        name: 'FN',
        value: 'John',
        options: { type: 'text' },
      },
    ];

    const expectedData = [
      {
        name: 'FN',
        value: 'John',
        required: false,
        onChangeValidate: false,
        options: { type: 'text' },
        validate: {},
        error: '',
        isValidField: true,
        touched: false,
      },
    ];
    expect(setPropertiesToForm(mockArray)).toEqual(expectedData);
  });

  it('should return array with additional data 4', () => {
    const mockArray = [
      {
        name: 'FN',
        value: 'John',
        validate: {
          required: (v: string): string => (v.trim() === '' ? 'Required' : ''),
        },
      },
    ];

    const expectedData = [
      {
        name: 'FN',
        value: 'John',
        validate: {
          required: (v: string): string => (v.trim() === '' ? 'Required' : ''),
        },
        required: false,
        onChangeValidate: false,
        options: {},
        error: '',
        touched: false,
        isValidField: true,
      },
    ];
    expect(JSON.stringify(setPropertiesToForm(mockArray))).toEqual(
      JSON.stringify(expectedData),
    );
  });

  it('should return array with additional data 5', () => {
    const mockArray = [
      {
        name: 'FN',
        value: 'John',
        error: 'test',
      },
    ];

    const expectedData = [
      {
        name: 'FN',
        value: 'John',
        required: false,
        onChangeValidate: false,
        options: {},
        validate: {},
        error: 'test',
        isValidField: true,
        touched: false,
      },
    ];
    expect(setPropertiesToForm(mockArray)).toEqual(expectedData);
  });

  it('should return array with additional data 6', () => {
    const mockArray = [
      {
        name: 'FN',
        value: 'John',
        touched: false,
      },
    ];

    const expectedData = [
      {
        name: 'FN',
        value: 'John',
        required: false,
        onChangeValidate: false,
        options: {},
        validate: {},
        error: '',
        isValidField: true,
        touched: false,
      },
    ];
    expect(setPropertiesToForm(mockArray)).toEqual(expectedData);
  });
});
