import { extractOption } from '../src/parser/extract-option';
import { extractTypeOption } from '../src/parser/extract-type-option';
import { extractDescriptionOption } from '../src/parser/extract-description-option';
import { createError } from '../src/error';

jest.mock('../src/parser/extract-type-option');
jest.mock('../src/parser/extract-description-option');
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
		expect(extractOption('<number>id=1')).toEqual({
			name: 'id',
			defaultValue: 1,
			multiple: false,
			type: Number,
			description: ''
		});

		mockExtractDescriptionOption.mockReturnValueOnce(['timeout=1', '']);
		mockExtractTypeOption.mockReturnValueOnce(['timeout=1', Boolean]);

		expect(extractOption('timeout=1')).toEqual({
			name: 'timeout',
			defaultValue: '1',
			multiple: false,
			type: String,
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

		mockExtractDescriptionOption.mockReturnValueOnce(['id*=false', '']);
		mockExtractTypeOption.mockReturnValueOnce(['id*=false', Boolean]);
		expect(extractOption('id*=false')).toEqual({
			name: 'id',
			defaultValue: [false],
			multiple: true,
			type: Boolean,
			description: ''
		});
	});

	test('Boolean значение', () => {
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

	test('Отсутствие токена', () => {
		mockCreateError.mockImplementation(() => {
			throw new Error('Не передан токен');
		});

		expect(() => extractOption(undefined)).toThrow('Не передан токен');
		expect(mockCreateError.mock.calls).toHaveLength(1);
		expect(mockCreateError).toHaveBeenLastCalledWith('Не передан токен');
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
