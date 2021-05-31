import { extractOptions } from '../src/parser/signature/extract-options';
import { extractOption } from '../src/parser/signature/extract-option';

jest.mock('../src/parser/signature/extract-option');
const mockExtractOption = <jest.MockedFunction<typeof extractOption>>extractOption;

test('Парсинг опций', () => {
	const tokens = ['--T|<number>timeout=1 : timeout in seconds', '--<string>start', '--loop=false'];

	mockExtractOption
		.mockReturnValueOnce({
			alias: 'T',
			name: 'timeout',
			defaultValue: 1,
			type: Number,
			multiple: false,
			description: 'timeout in seconds'
		})
		.mockReturnValueOnce({
			name: 'start',
			type: String,
			multiple: false,
			defaultValue: null,
			description: ''
		})
		.mockReturnValueOnce({
			name: 'loop',
			type: Boolean,
			multiple: false,
			defaultValue: false,
			description: ''
		});

	let options = extractOptions(tokens);

	expect(options).toBeInstanceOf(Array);
	expect(options).toEqual([
		{
			alias: 'T',
			name: 'timeout',
			defaultValue: 1,
			type: Number,
			multiple: false,
			description: 'timeout in seconds'
		},
		{
			name: 'start',
			type: String,
			multiple: false,
			defaultValue: null,
			description: ''
		},
		{
			name: 'loop',
			type: Boolean,
			multiple: false,
			defaultValue: false,
			description: ''
		}
	]);

	options = extractOptions(['1']);
	expect(options).toEqual([]);
	expect(mockExtractOption.mock.calls).toHaveLength(3);
	expect(mockExtractOption).toHaveBeenNthCalledWith(2, '<string>start');
});
