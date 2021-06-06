import { extractNameCommand } from '../src/parser/extract-name-command';

const signature = 'test-command {--T|<number>timeout=1 : время в секундах}';

test('Получение имени команды', () => {
	expect(extractNameCommand(signature)).toBe('test-command');
	expect(extractNameCommand('signature-1')).toBe('signature-1');
	Array.from<any>(['1111', undefined, null, 0]).forEach((item) => {
		expect(() => extractNameCommand(item)).toThrow('Невозможно определить имя команды');
	});
});
