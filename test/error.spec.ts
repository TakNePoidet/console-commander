import { createError } from '../src/error';

test('Вывод ошибки', () => {
	expect(() =>
		// @ts-ignore
		createError()
	).toThrow('Неизвесная ошибка');
	expect(() => createError('Передан параметр')).toThrow('Передан параметр');
	expect(() => createError(new Error('ошибка'))).toThrow('ошибка');
});
