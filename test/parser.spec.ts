import { Definition } from '../src/types';
import { parse } from '../src/parser/signature/parser';
import { extractNameCommand } from '../src/parser/signature/extract-name-command';
import { extractOptions } from '../src/parser/signature/extract-options';

jest.mock('../src/parser/signature/extract-name-command');
jest.mock('../src/parser/signature/extract-options');

const mockExtractNameCommand = <jest.MockedFunction<typeof extractNameCommand>>extractNameCommand;
const mockExtractOptions = <jest.MockedFunction<typeof extractOptions>>extractOptions;

const signature = 'test-command {--T|<number>timeout=1 : timeout in seconds}';

test('Парсинг сигнатуры команды', () => {
	mockExtractNameCommand.mockImplementation(() => 'test-command');
	mockExtractOptions.mockImplementation(() => [
		{
			alias: 'T',
			name: 'timeout',
			defaultValue: 1,
			type: Number,
			multiple: false,
			description: 'timeout in seconds'
		}
	]);
	expect(parse(signature)).toBeInstanceOf(Array);
	expect(parse(signature)).toHaveLength(2);
	expect(parse(signature)).toEqual([
		'test-command',
		[
			{
				alias: 'T',
				name: 'timeout',
				defaultValue: 1,
				type: Number,
				multiple: false,
				description: 'timeout in seconds'
			} as Definition
		]
	]);

	expect(mockExtractNameCommand.mock.calls).toHaveLength(3);
	expect(mockExtractNameCommand).toHaveBeenLastCalledWith(signature);

	expect(mockExtractOptions.mock.calls).toHaveLength(3);
	expect(mockExtractOptions).toHaveBeenLastCalledWith(['--T|<number>timeout=1 : timeout in seconds']);
	expect(parse('test-command')).toEqual(['test-command', []]);
});
