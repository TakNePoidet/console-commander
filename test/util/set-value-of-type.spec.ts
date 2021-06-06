import * as util from '../../src/util';

test('Конвертирование значения согласну типу', () => {
	expect(util.setValueOfType('1', Number)).toEqual(1);
	expect(util.setValueOfType(2, String)).toEqual('2');
	expect(util.setValueOfType('false', Boolean)).toEqual(false);
});
