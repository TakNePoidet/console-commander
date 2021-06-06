import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Command } from '../src';

jest.mock('command-line-args');
jest.mock('command-line-usage');

const mockCommandLineArgs = <jest.MockedFunction<typeof commandLineArgs>>commandLineArgs;
const mockCommandLineUsage = <jest.MockedFunction<typeof commandLineUsage>>commandLineUsage;

export const commandNameProperty = {
	definitions: 'definitions',
	parseOption: 'parseOption',

	commandName: 'commandName',
	description: 'description',
	help: 'help',
	options: 'options'
};

beforeEach(() => {
	mockCommandLineArgs.mockReset();
	mockCommandLineUsage.mockReset();
});

function createClassCommandTest() {
	// @ts-ignore
	const CommandTest = class extends Command {};

	return new CommandTest();
}

describe('Базовый класс команды', () => {
	describe('Парсинг командной строки', () => {
		test('Без глобальных параметров', () => {
			mockCommandLineArgs.mockReturnValueOnce({ timeout: 1 });
			const command = createClassCommandTest();

			command[commandNameProperty.definitions] = [
				{
					name: 'timeout',
					type: Number,
					defaultValue: null
				}
			];
			command[commandNameProperty.parseOption]([], ['--timeout', '1']);
			expect(mockCommandLineArgs).toHaveBeenCalled();
			expect(mockCommandLineArgs.mock.calls).toHaveLength(1);
			expect(mockCommandLineArgs).toHaveBeenLastCalledWith(
				[
					{
						name: 'timeout',
						type: Number,
						defaultValue: null
					},
					{
						name: 'help',
						alias: 'H',
						type: Boolean,
						defaultValue: false,
						description: 'Вызов справки'
					}
				],
				{
					argv: ['--timeout', '1'],
					stopAtFirstUnknown: true
				}
			);
		});
		test('С глобальными параметрами', () => {
			mockCommandLineArgs.mockReturnValueOnce({ help: false, timeout: 1 });
			const command = createClassCommandTest();

			command[commandNameProperty.definitions] = [
				{
					name: 'help',
					alias: 'H',
					type: Boolean,
					defaultValue: false,
					description: 'Вызов справки'
				},
				{
					name: 'timeout',
					type: Number,
					defaultValue: null
				}
			];
			command[commandNameProperty.parseOption](
				{
					help: false
				},
				['--timeout', '1']
			);
			expect(mockCommandLineArgs).toHaveBeenCalled();
			expect(mockCommandLineArgs.mock.calls).toHaveLength(1);
			expect(mockCommandLineArgs).toHaveBeenLastCalledWith(
				[
					{
						name: 'help',
						alias: 'H',
						type: Boolean,
						defaultValue: false,
						description: 'Вызов справки'
					},
					{
						name: 'timeout',
						type: Number,
						defaultValue: null
					}
				],
				{
					argv: ['--timeout', '1'],
					stopAtFirstUnknown: true
				}
			);

			expect(command[commandNameProperty.options]).toEqual({
				timeout: 1,
				help: false
			});
		});
	});
	test('Формирование справки', () => {
		mockCommandLineUsage.mockReturnValue('help');
		const command = createClassCommandTest();

		command[commandNameProperty.commandName] = 'test';
		command[commandNameProperty.description] = 'тестовая команда';
		command[commandNameProperty.definitions] = [
			{
				alias: 'T',
				name: 'timeout',
				defaultValue: 1,
				type: Number,
				multiple: false,
				description: 'Время в секундах'
			}
		];
		command[commandNameProperty.help]();
		expect(mockCommandLineUsage).toHaveBeenCalled();
		expect(mockCommandLineUsage.mock.calls).toHaveLength(1);

		const sections = [
			{
				header: 'Описание команды',
				content: 'тестовая команда'
			},
			{
				header: 'Пример',
				content: `$ app test <options>`
			},
			{
				header: 'Список опций команды',
				optionList: [
					{
						name: 'help',
						description: 'Вывод справки',
						alias: 'H',
						type: Boolean
					},
					{
						name: 'timeout',
						description: 'Время в секундах',
						alias: 'T',
						type: Number
					}
				]
			}
		];

		expect(typeof mockCommandLineUsage.mock.results[0].value).toBe('string');
		expect(mockCommandLineUsage).toHaveBeenLastCalledWith(sections);
	});
});
