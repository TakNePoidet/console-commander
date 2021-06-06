import { extractTypeOption } from '../src/parser/extract-type-option';

test('Получение типа опции', () => {
	const token = '<number>timeout';

	expect(extractTypeOption(token)).toHaveLength(2);
	expect(extractTypeOption(token)).toBeInstanceOf(Object);
	expect(extractTypeOption('loop')).toEqual(['loop', Boolean]);
	expect(extractTypeOption('<number>timeout')).toEqual(['timeout', Number]);
	expect(extractTypeOption('<string>title')).toEqual(['title', String]);
	expect(extractTypeOption('<boolean>loop')).toEqual(['loop', Boolean]);

	expect(() => extractTypeOption('<bolean>loop')).toThrow('Неизвестный тип для параметра loop');
	expect(() => extractTypeOption('<bolean>')).toThrow('Неверный формат токена');
	expect(() => extractTypeOption('<bol1ean>')).toThrow('Неверный формат токена');
	expect(() => extractTypeOption('<bool>loop')).toThrow('Неизвестный тип для параметра loop');
	expect(() => extractTypeOption('<>')).toThrow('Неверный формат токена');
	Array.from<any>([null, false, undefined]).forEach((item) => {
		expect(() => extractTypeOption(item)).toThrow('Непередан токен');
	});
});
