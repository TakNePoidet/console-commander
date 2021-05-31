import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Command } from '../src/command';

jest.mock('command-line-args');
jest.mock('command-line-usage');

const commandLineArgsMock = commandLineArgs as jest.MockedFunction<typeof commandLineArgs>;
const commandLineUsageMock = commandLineUsage as jest.MockedFunction<typeof commandLineUsage>;

beforeEach(() => {
	commandLineArgsMock.mockReset();
	commandLineUsageMock.mockReset();
});

function createClassCommandTest() {
	// @ts-ignore
	const CommandTest = class extends Command {};
	const command = new CommandTest();

	return command;
}

describe('Базовый класс команды', () => {
	test('Парсинг командной строки', () => {
		commandLineArgsMock.mockReturnValue(
			// @ts-ignore
			{ help: true }
		);
		const command = createClassCommandTest();

		// @ts-ignore
		command.definitions = [];
		// @ts-ignore
		command.parseOption({}, ['--help']);
		expect(commandLineArgsMock).toHaveBeenCalled();
		expect(commandLineArgsMock.mock.calls).toHaveLength(1);
		expect(commandLineArgsMock).toHaveBeenLastCalledWith(
			[
				{
					name: 'help',
					alias: 'H',
					type: Boolean,
					defaultValue: false,
					description: 'Вызов справки'
				}
			],
			{
				argv: ['--help'],
				stopAtFirstUnknown: false
			}
		);
		expect(commandLineArgsMock.mock.results[0].value).toEqual({ help: true });
	});
	test('Формирование справки', () => {
		commandLineUsageMock.mockReturnValue('help');
		const command = createClassCommandTest();

		// @ts-ignore
		command.commandName = 'test';
		command.description = 'тестовая команда';
		// @ts-ignore
		command.definitions = [
			{
				alias: 'T',
				name: 'timeout',
				defaultValue: 1,
				type: Number,
				multiple: false,
				description: 'Время в секундах'
			}
		];
		// @ts-ignore
		command.help();
		expect(commandLineUsageMock).toHaveBeenCalled();
		expect(commandLineUsageMock.mock.calls).toHaveLength(1);

		const sections = [
			{
				header: 'Описание команды',
				content: 'тестовая команда'
			},
			{
				header: 'Synopsis',
				content: `$ app test <options>`
			},
			{
				header: 'List of available options for the command',
				optionList: [
					{
						name: 'help',
						description: 'Getting help from the command',
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

		expect(typeof commandLineUsageMock.mock.results[0].value).toBe('string');
		expect(commandLineUsageMock).toHaveBeenLastCalledWith(sections);
	});
});
