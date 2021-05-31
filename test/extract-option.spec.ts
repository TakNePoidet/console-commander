import { extractOption } from '../src/parser/signature/extract-option';
import { extractTypeOption } from '../src/parser/signature/extract-type-option';
import { extractDescriptionOption } from '../src/parser/signature/extract-description-option';
import { createError } from '../src/error';

jest.mock('../src/parser/signature/extract-type-option');
jest.mock('../src/parser/signature/extract-description-option');
jest.mock('../src/error');

const mockExtractTypeOption = <jest.MockedFunction<typeof extractTypeOption>>extractTypeOption;
const mockExtractDescriptionOption = <jest.MockedFunction<typeof extractDescriptionOption>>extractDescriptionOption;
const mockCreateError = <jest.MockedFunction<typeof createError>>createError;

beforeEach(() => {
	mockExtractTypeOption.mockReset();
	mockExtractDescriptionOption.mockReset();
	mockCreateError.mockReset();
});

describe('Парсинг опции', () => {
	test('Массив', () => {
		mockExtractDescriptionOption.mockReturnValueOnce(['src*', '']);
		mockExtractTypeOption.mockReturnValueOnce(['src*', Boolean]);
		expect(extractOption('src*')).toEqual({
			name: 'src',
			defaultValue: [],
			multiple: true,
			type: String,
			description: ''
		});
		expect(mockExtractDescriptionOption).toHaveBeenLastCalledWith('src*');
		expect(mockExtractDescriptionOption.mock.calls).toHaveLength(1);
		expect(mockExtractTypeOption).toHaveBeenLastCalledWith('src*');
		expect(mockExtractTypeOption.mock.calls).toHaveLength(1);

		mockExtractDescriptionOption.mockReturnValueOnce(['<string>src*', '']);
		mockExtractTypeOption.mockReturnValueOnce(['src*', String]);
		expect(extractOption('src*')).toEqual({
			name: 'src',
			defaultValue: [],
			multiple: true,
			type: String,
			description: ''
		});
	});

	test('Массив чисел', () => {
		mockExtractDescriptionOption.mockReturnValueOnce(['<number>id*=', '']);
		mockExtractTypeOption.mockReturnValueOnce(['id*=', Number]);
		expect(extractOption('<number>id*=')).toEqual({
			name: 'id',
			defaultValue: [],
			multiple: true,
			type: Number,
			description: ''
		});
		expect(mockExtractDescriptionOption).toHaveBeenLastCalledWith('<number>id*=');
		expect(mockExtractDescriptionOption.mock.calls).toHaveLength(1);
		expect(mockExtractTypeOption).toHaveBeenLastCalledWith('<number>id*=');
		expect(mockExtractTypeOption.mock.calls).toHaveLength(1);

		mockExtractDescriptionOption.mockReturnValueOnce(['id*=', '']);
		mockExtractTypeOption.mockReturnValueOnce(['id*=', Boolean]);
		expect(extractOption('id*=')).toEqual({
			name: 'id',
			defaultValue: [],
			multiple: true,
			type: String,
			description: ''
		});
	});

	test('Массив чисел со значением по умолчанию', () => {
		mockExtractDescriptionOption.mockReturnValueOnce(['<number>id*=1', '']);
		mockExtractTypeOption.mockReturnValueOnce(['id*=1', Number]);
		expect(extractOption('<number>id*=1')).toEqual({
			name: 'id',
			defaultValue: [1],
			multiple: true,
			type: Number,
			description: ''
		});
		expect(mockExtractDescriptionOption).toHaveBeenLastCalledWith('<number>id*=1');
		expect(mockExtractDescriptionOption.mock.calls).toHaveLength(1);
		expect(mockExtractTypeOption).toHaveBeenLastCalledWith('<number>id*=1');
		expect(mockExtractTypeOption.mock.calls).toHaveLength(1);
	});

	test('Ожидание значения', () => {
		mockExtractDescriptionOption.mockReturnValueOnce(['N|name=', '']);
		mockExtractTypeOption.mockReturnValueOnce(['name=', Boolean]);
		expect(extractOption('N|name=')).toEqual({
			alias: 'N',
			name: 'name',
			defaultValue: null,
			multiple: false,
			type: String,
			description: ''
		});
		expect(mockExtractDescriptionOption).toHaveBeenLastCalledWith('N|name=');
		expect(mockExtractDescriptionOption.mock.calls).toHaveLength(1);
		expect(mockExtractTypeOption).toHaveBeenLastCalledWith('name=');
		expect(mockExtractTypeOption.mock.calls).toHaveLength(1);

		mockExtractDescriptionOption.mockReturnValueOnce(['N|<string>name=', '']);
		mockExtractTypeOption.mockReturnValueOnce(['name=', String]);
		expect(extractOption('N|<string>name=')).toEqual({
			alias: 'N',
			name: 'name',
			defaultValue: null,
			multiple: false,
			type: String,
			description: ''
		});
	});

	test('Значение по умолчанию', () => {
		mockExtractDescriptionOption.mockReturnValueOnce(['loop=false', '']);
		mockExtractTypeOption.mockReturnValueOnce(['loop=false', Boolean]);
		expect(extractOption('loop=false')).toEqual({
			name: 'loop',
			defaultValue: false,
			multiple: false,
			type: Boolean,
			description: ''
		});
		expect(mockExtractDescriptionOption).toHaveBeenLastCalledWith('loop=false');
		expect(mockExtractDescriptionOption.mock.calls).toHaveLength(1);
		expect(mockExtractTypeOption).toHaveBeenLastCalledWith('loop=false');
		expect(mockExtractTypeOption.mock.calls).toHaveLength(1);

		mockExtractDescriptionOption.mockReturnValueOnce(['<number>id=1', '']);
		mockExtractTypeOption.mockReturnValueOnce(['id=1', Number]);
		expect(extractOption('<number>id')).toEqual({
			name: 'id',
			defaultValue: 1,
			multiple: false,
			type: Number,
			description: ''
		});
	});

	test('Значение по умолчанию в массиве', () => {
		mockExtractDescriptionOption.mockReturnValueOnce(['id*=1', '']);
		mockExtractTypeOption.mockReturnValueOnce(['id*=1', Boolean]);
		expect(extractOption('id*=1')).toEqual({
			name: 'id',
			defaultValue: ['1'],
			multiple: true,
			type: String,
			description: ''
		});
	});

	test('Болеан значение', () => {
		mockExtractDescriptionOption.mockReturnValueOnce(['loop', '']);
		mockExtractTypeOption.mockReturnValueOnce(['loop', Boolean]);
		expect(extractOption('loop')).toEqual({
			name: 'loop',
			defaultValue: false,
			multiple: false,
			type: Boolean,
			description: ''
		});
		expect(mockExtractDescriptionOption).toHaveBeenLastCalledWith('loop');
		expect(mockExtractDescriptionOption.mock.calls).toHaveLength(1);
		expect(mockExtractTypeOption).toHaveBeenLastCalledWith('loop');
		expect(mockExtractTypeOption.mock.calls).toHaveLength(1);

		mockExtractDescriptionOption.mockReturnValueOnce(['<number>id', '']);
		mockExtractTypeOption.mockReturnValueOnce(['id', Number]);
		expect(extractOption('<number>id')).toEqual({
			name: 'id',
			defaultValue: null,
			multiple: false,
			type: Number,
			description: ''
		});
	});

	test('Отсутвие токена', () => {
		mockCreateError.mockImplementation(() => {
			throw new Error('Непередан токен');
		});

		expect(() => extractOption(undefined)).toThrow('Непередан токен');
		expect(mockCreateError.mock.calls).toHaveLength(1);
		expect(mockCreateError).toHaveBeenLastCalledWith('Непередан токен');
	});

	test('Ошибка', () => {
		mockCreateError.mockImplementationOnce(() => {
			throw new Error('Неверный формат токена');
		});
		mockExtractTypeOption.mockImplementationOnce(() => {
			throw new Error('Неверный формат токена');
		});

		mockExtractDescriptionOption.mockReturnValueOnce(['<numb1er>id=1', '']);
		expect(() => extractOption('<numb1er>id=1')).toThrow('Неверный формат токена');
		expect(mockCreateError.mock.calls).toHaveLength(1);
		expect(mockCreateError).toHaveBeenLastCalledWith('Неверный формат токена');
	});
});
// test('Парсинг одной опции', () => {
// 	const token = 'T|<number>timeout=1 : timeout in seconds';
//
// 	mockExtractDescriptionOption.mockReturnValueOnce(['T|<number>timeout=1', 'timeout in seconds']);
// 	mockExtractTypeOption.mockReturnValueOnce(['timeout=1', Number]);
//
// 	const definition: Definition = extractOption(token);
//
// 	expect(mockExtractDescriptionOption).toHaveBeenCalledWith('T|<number>timeout=1 : timeout in seconds');
// 	expect(mockExtractTypeOption).toHaveBeenCalledWith('<number>timeout=1');
//
// 	expect(definition).toBeInstanceOf(Object);
// 	expect(definition).toMatchObject({
// 		alias: 'T',
// 		name: 'timeout',
// 		defaultValue: 1,
// 		type: Number,
// 		multiple: false,
// 		description: 'timeout in seconds'
// 	});
// 	expect(definition).not.toBeUndefined();
//
// 	mockExtractDescriptionOption.mockReturnValueOnce(['src*', '']);
// 	mockExtractTypeOption.mockReturnValueOnce(['src*', Boolean]);
// 	expect(extractOption('src*')).toEqual({
// 		name: 'src',
// 		defaultValue: [],
// 		multiple: true,
// 		type: String,
// 		description: ''
// 	});
//
// 	mockExtractDescriptionOption.mockReturnValueOnce(['<number>id*=', '']);
// 	mockExtractTypeOption.mockReturnValueOnce(['id*=', Number]);
// 	expect(extractOption('<number>id=*')).toEqual({
// 		name: 'id',
// 		defaultValue: [],
// 		multiple: true,
// 		type: Number,
// 		description: ''
// 	});
//
// 	mockExtractDescriptionOption.mockReturnValueOnce(['<number>id*=', '']);
// 	mockExtractTypeOption.mockReturnValueOnce(['id=', Number]);
// 	expect(extractOption('<number>id=')).toEqual({
// 		name: 'id',
// 		defaultValue: null,
// 		multiple: false,
// 		type: Number,
// 		description: ''
// 	});
//
// 	expect(extractOption('<number>src*=1')).toEqual({
// 		name: 'src',
// 		defaultValue: [1],
// 		multiple: true,
// 		type: Number,
// 		description: ''
// 	} as Definition);
//

//
// 	//
// 	// expect(extractOption('<number>src*')).toEqual({
// 	// 	name: 'src',
// 	// 	defaultValue: [],
// 	// 	multiple: true,
// 	// 	type: Number,
// 	// 	description: ''
// 	// } as Definition);
// 	// expect(extractOption('src*=test')).toEqual({
// 	// 	name: 'src',
// 	// 	defaultValue: ['test'],
// 	// 	multiple: true,
// 	// 	type: String,
// 	// 	description: ''
// 	// } as Definition);
// 	// expect(extractOption('<number>src*=1')).toEqual({
// 	// 	name: 'src',
// 	// 	defaultValue: [1],
// 	// 	multiple: true,
// 	// 	type: Number,
// 	// 	description: ''
// 	// } as Definition);
// 	// expect(extractOption('<number>src')).toEqual({
// 	// 	name: 'src',
// 	// 	defaultValue: null,
// 	// 	multiple: false,
// 	// 	type: Number,
// 	// 	description: ''
// 	// } as Definition);
// 	//
// 	// expect(extractOption('<number>src*=')).toEqual({
// 	// 	name: 'src',
// 	// 	defaultValue: [],
// 	// 	multiple: true,
// 	// 	type: Number,
// 	// 	description: ''
// 	// } as Definition);
// 	//
// 	// expect(extractOption('<number>src=')).toEqual({
// 	// 	name: 'src',
// 	// 	defaultValue: null,
// 	// 	multiple: false,
// 	// 	type: Number,
// 	// 	description: ''
// 	// } as Definition);
// 	//
// 	// Array.from<any>([null, false, undefined]).forEach((token) => {
// 	// 	expect(() => extractOption(token)).toThrow('Непередан токен');
// 	// });
// });
