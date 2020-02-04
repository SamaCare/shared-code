const { getValue, CUSTOM_FIELDS } = require('.');

describe('inputConfigurationManager', () => {
  it('getValue should get the proper value for an input with no sama type', async () => {
    const input = { id: 1 };
    const value = 'test';
    const results = { 1: value };
    expect(getValue(results, input.id, input.samaTypes)).toBe(value);
  });
  it('getValue should get the proper value for an input with a single sama type as a string', async () => {
    const input = { id: 1, samaTypes: ['TEST'] };
    const value = 'test';
    const results = { TEST: value };
    expect(getValue(results, input.id, input.samaTypes)).toBe(value);
  });
  it('getValue should get the proper value for an input with a single sama type as an array', async () => {
    const input = { id: 1, samaTypes: ['TEST'] };
    const value = 'test';
    const results = { TEST: value };
    expect(getValue(results, input.id, input.samaTypes)).toBe(value);
  });
  it('getValue should get the proper value for an input with multiple sama types', async () => {
    const input = { id: 1, samaTypes: ['TEST1', 'TEST2'] };
    const value1 = 'test1';
    const value2 = 'test2';
    const results = { TEST1: value1, TEST2: value2 };
    expect(getValue(results, input.id, input.samaTypes)).toBe(`${value1} ${value2}`);
  });
  it('getValue should get the proper value for an input with multiple sama types even if one doesn\t have a value', async () => {
    const input = { id: 1, samaTypes: ['TEST1', 'TEST2'] };
    const value2 = 'test2';
    const results = { TEST2: value2 };
    expect(getValue(results, input.id, input.samaTypes)).toBe(value2);
  });
  it('getValue should work even for an input with multiple sama types with no matching values', async () => {
    const input = { id: 1, samaTypes: ['TEST1', 'TEST2'] };
    expect(getValue({}, input.id, input.samaTypes)).toBe('');
  });
  it('getValue should get the id-matched value for an input with a sama type and also a value matching the id in the results', async () => {
    const input = { id: 1, samaTypes: ['TEST'] };
    const idValue = 'test1';
    const samaTypeValue = 'test1';
    const results = { id: idValue, TEST: samaTypeValue };
    expect(getValue(results, input.id, input.samaTypes)).toBe(idValue);
  });
  it('getValue should not return samaType value if result is non-nil', async () => {
    const input = { id: 1, samaTypes: ['TEST'] };
    expect(getValue({ TEST: 'Scott', 1: '' }, input.id, input.samaTypes)).toBe('');
  });
  it('getValue should return null if value doesnt exist', async () => {
    const input = { id: 1, samaTypes: [] };
    expect(getValue({}, input.id, input.samaTypes)).toBe(null);
  });
  it('getValue should return null if value doesnt exist even if there is an undefined key in config', async () => {
    const input = { id: 1, samaTypes: [] };
    expect(getValue({ undefined: 'not null' }, input.id, input.samaTypes)).toBe(null);
  });
  it('getValue should return custom field values', async () => {
    const input = { id: 1, samaTypes: [CUSTOM_FIELDS.SAMA_FAX.key] };
    expect(getValue({}, input.id, input.samaTypes)).toBe(CUSTOM_FIELDS.SAMA_FAX.value);
  });
  it('should only return truthy sama values', async () => {
    const FAKE_SAMA_TYPE = 'fake';
    const input = { id: 1, samaTypes: [FAKE_SAMA_TYPE] };
    expect(getValue({ [FAKE_SAMA_TYPE]: null }, input.id, input.samaTypes)).toBe('');
  });
});
