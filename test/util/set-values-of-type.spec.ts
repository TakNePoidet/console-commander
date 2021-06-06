import * as util from '../../src/util';

test('Конвертирование значения в массиве согласну типу', () => {
	expect(util.setValuesOfType(['1'], Number)).toEqual([1]);
	expect(util.setValuesOfType([2], String)).toEqual(['2']);
	expect(util.setValuesOfType(['false'], Boolean)).toEqual([false]);
});
