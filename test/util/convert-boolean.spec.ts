import { convertBoolean } from '../../src/util';

test('Ковертирование в boolean', () => {
	expect(convertBoolean('1')).toBe(true);
	expect(convertBoolean('0')).toBe(false);
	expect(convertBoolean('true')).toBe(true);
	expect(convertBoolean('false')).toBe(false);
	expect(convertBoolean(true)).toBe(true);
	expect(convertBoolean(false)).toBe(false);
	expect(convertBoolean('111')).toBe(false);
});
