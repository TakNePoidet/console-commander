import { extractDescriptionOption } from '../src/parser/extract-description-option';

test('Получение описания опции', () => {
	const token = 'timeout : таймаут в секундах';

	expect(extractDescriptionOption(token)).toHaveLength(2);
	expect(extractDescriptionOption(token)).toBeInstanceOf(Array);
	expect(extractDescriptionOption(token)).toEqual(['timeout', 'таймаут в секундах']);
	expect(extractDescriptionOption('timeout : ')).toEqual(['timeout', '']);
	expect(extractDescriptionOption('timeout')).toEqual(['timeout', '']);
	expect(extractDescriptionOption('timeout*')).toEqual(['timeout*', '']);
	expect(extractDescriptionOption('<number>timeout=1 : timeout in seconds')).toEqual([
		'<number>timeout=1',
		'timeout in seconds'
	]);
	expect(extractDescriptionOption('<number>timeout*')).toEqual(['<number>timeout*', '']);
	expect(() => extractDescriptionOption('timeout: ')).toThrow('Невалидный формат описания опции');
	expect(() => extractDescriptionOption('timeout:')).toThrow('Невалидный формат описания опции');
	Array.from<any>([null, false, undefined]).forEach((token) => {
		expect(() => extractDescriptionOption(token)).toThrow('Не передан токен');
	});
});
