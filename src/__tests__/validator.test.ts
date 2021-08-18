import { validator } from '../lib/helpers';

const rules = {
  required: (v: any) => (v.trim() === '' ? 'Required' : ''),
  availableNumber: (v: any | boolean): string => {
    if (typeof v === 'number') return v > 0 && v < 100 ? '' : 'Invalid';
    if (typeof v === 'string')
      return parseInt(v) > 0 && parseInt(v) < 100 ? '' : 'Invalid';

    return 'Invalid type';
  },
};

describe('validator()', () => {
  it('should return error = Required', () => {
    expect(validator('', {}, rules)).toEqual('Required');
  });

  it('should return error = Invalid', () => {
    expect(validator('1333', {}, rules)).toEqual('Invalid');
  });

  it('should return no error with incorrect rules', () => {
    const rules = {
      req: 'Required',
    };

    expect(validator('12', {}, rules as any)).toEqual('');
  });

  it('should return no error', () => {
    expect(validator('12', {}, rules)).toEqual('');
    expect(validator('12', {})).toEqual('');
  });
});
