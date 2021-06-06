// eslint-disable-next-line max-classes-per-file
import commandLineUsage from 'command-line-usage';
import { table } from 'table';
import commandLineArgs from 'command-line-args';
import { Commander } from '../src';
import { Command, CommandPrivate } from '../src/command';
import { createError } from '../src/error';
import { parser } from '../src/parser';
import { CommandDescription } from '../src/types';
// @ts-ignore
import { commandNameProperty } from './command.spec';

jest.mock('../src/error');
jest.mock('../src/parser');
jest.mock('command-line-usage');
jest.mock('command-line-args');
jest.mock('table');

let commander = new Commander();
const commanderProperty = {
	commands: 'commands',
	registration: 'registration',
	getListCommand: 'getListCommand',
	printListCommand: 'printListCommand',
	printHelp: 'printHelp'
};

const mockCreateError = <jest.MockedFunction<typeof createError>>createError;
const mockParser = <jest.MockedFunction<typeof parser>>parser;
const mockCommandLineUsage = <jest.MockedFunction<typeof commandLineUsage>>commandLineUsage;
const mockCommandLineArgs = <jest.MockedFunction<typeof commandLineArgs>>commandLineArgs;
const mockTable = <jest.MockedFunction<typeof table>>table;

beforeEach(() => {
	commander = new Commander();
	mockCreateError.mockReset();
	mockParser.mockReset();
	mockCommandLineUsage.mockReset();
	mockCommandLineArgs.mockReset();
	mockTable.mockReset();
});

function createTestClass(signature: any = '', base: any = Command): { new (): CommandPrivate } {
	// @ts-ignore
	return class extends base {
		signature = signature;

		description = `Описание команды '${signature}'`;
	};
}

describe('Менеджер', () => {
	describe('Регистрация новой команды', () => {
		test('Передача не класса', () => {
			mockCreateError.mockImplementationOnce(() => {
				throw new Error('Команда не является функцией котсруктором');
			});
			expect(() => commander[commanderProperty.registration]({})).toThrow('Команда не является функцией котсруктором');
		});
		test('Передача класаа без базового класаа', () => {
			mockCreateError.mockImplementationOnce(() => {
				throw new Error('Команда не является инстансом базового класса `Command`');
			});
			expect(() => commander[commanderProperty.registration](createTestClass('', String))).toThrow(
				'Команда не является инстансом базового класса `Command`'
			);
		});
		test('Без сигнатуры команды', () => {
			mockCreateError.mockImplementationOnce(() => {
				throw new Error('Отсутствует сигнатура команды');
			});
			expect(() => commander[commanderProperty.registration](createTestClass(null))).toThrow(
				'Отсутствует сигнатура команды'
			);
			expect(() => commander[commanderProperty.registration](createTestClass('test-command'))).not.toThrow(
				'Отсутствует сигнатура команды'
			);
		});

		test('Парсинг сигнатуры', () => {
			mockParser.mockImplementationOnce(() => [
				'test-command',
				[
					{
						alias: 'T',
						name: 'timeout',
						defaultValue: 1,
						type: Number,
						multiple: false,
						description: ''
					}
				]
			]);
			commander[commanderProperty.registration](createTestClass('test-command --timeout=1'));

			expect(mockParser.mock.calls).toHaveLength(1);
			expect(mockParser).toHaveBeenCalledWith('test-command --timeout=1');
			expect(mockParser).toHaveLastReturnedWith([
				'test-command',
				[
					{
						alias: 'T',
						name: 'timeout',
						defaultValue: 1,
						type: Number,
						multiple: false,
						description: ''
					}
				]
			]);
			expect(commander[commanderProperty.commands].size).toBe(1);
			expect(commander[commanderProperty.commands].has('test-command')).toBeTruthy();
			expect(commander[commanderProperty.commands].has('test-command')).toBe(true);

			const command = commander[commanderProperty.commands].get('test-command');

			expect(command.commandName).toBe('test-command');
			expect(command.definitions).toEqual([
				{
					alias: 'T',
					name: 'timeout',
					defaultValue: 1,
					type: Number,
					multiple: false,
					description: ''
				}
			]);
		});
	});
	describe('Добавление команд', () => {
		let commands;

		beforeEach(() => {
			commands = Array.from(new Array(2)).map((_, i) => createTestClass(`test-command-${i}`));
		});
		test('Пустой массив команды', () => {
			mockCreateError.mockImplementationOnce(() => {
				throw new Error('Не переданы команды для регистрации');
			});
			expect(() => commander.append()).toThrow('Не переданы команды для регистрации');
		});
		test('Добавление команд', () => {
			const mockRegistration = jest.spyOn<Commander, any>(commander, 'registration').mockReturnThis();

			expect(commander.append(...commands)).toEqual(commander);
			expect(mockRegistration).toHaveBeenCalledTimes(2);
			expect(mockRegistration).toHaveBeenLastCalledWith(commands.pop());
		});
	});
	describe('Работа со списками команд', () => {
		test('Получение списка команд', () => {
			const CommandConstructor = createTestClass('test-command');
			const command = new CommandConstructor();

			command.commandName = 'test-command';

			commander[commanderProperty.commands].set('test-command', command);
			const list = commander[commanderProperty.getListCommand]();

			expect(list).toBeInstanceOf(Array);
			expect(list).toHaveLength(1);
			expect(list).toEqual([
				{
					name: 'test-command',
					summary: `Описание команды 'test-command'`
				}
			]);
		});
		describe('Вывод в консоль команд', () => {
			function createMockPrint() {
				const mockGetListCommand = jest.spyOn<Commander, any>(commander, 'getListCommand');

				const mockConsole = jest.spyOn(console, 'log');

				mockGetListCommand.mockReset().mockImplementation((): CommandDescription[] => [
					{
						name: 'test-command',
						summary: 'пример команды'
					}
				]);
				mockConsole.mockReset().mockImplementation();
				return { mockGetListCommand, mockConsole };
			}

			test('Вывод списка команд', () => {
				const { mockConsole, mockGetListCommand } = createMockPrint();

				mockTable.mockImplementation();
				commander[commanderProperty.printListCommand]();
				expect(mockTable).toHaveBeenCalledTimes(1);
				expect(mockTable).toHaveBeenCalledWith([[1, 'test-command', 'пример команды']]);
				expect(mockGetListCommand).toHaveBeenCalledTimes(1);
				expect(mockConsole).toHaveBeenCalledTimes(1);
			});
			test('Вывод справки', () => {
				mockCommandLineUsage.mockReturnValue('help');
				const { mockConsole, mockGetListCommand } = createMockPrint();

				commander[commanderProperty.printHelp]();
				expect(mockGetListCommand).toHaveBeenCalledTimes(1);
				expect(mockCommandLineUsage).toHaveBeenCalledTimes(1);
				expect(mockConsole).toHaveBeenCalledTimes(1);
			});
		});
	});
	test('Вывод справки', async () => {
		mockCommandLineArgs.mockReturnValueOnce({
			help: true
		});
		const mockPrintHelp = jest.spyOn<Commander, any>(commander, 'printHelp').mockImplementation();

		await expect(commander.start()).resolves.not.toThrow();
		expect(mockPrintHelp).toHaveBeenCalledTimes(1);
		expect(mockCommandLineArgs).toHaveBeenCalledTimes(1);
	});
	test('Вывод списка команд', async () => {
		mockCommandLineArgs.mockReturnValueOnce({
			list: true
		});
		const mockPrintListCommand = jest.spyOn<Commander, any>(commander, 'printListCommand').mockImplementation();

		await expect(commander.start()).resolves.not.toThrow();
		expect(mockPrintListCommand).toHaveBeenCalledTimes(1);
		expect(mockCommandLineArgs).toHaveBeenCalledTimes(1);
	});
	describe('Старт работы менеджера', () => {
		test('Не введено имя команды', async () => {
			mockCommandLineArgs.mockReturnValueOnce({});
			await expect(commander.start()).rejects.toThrow('Введите имя команды');
			expect(mockCommandLineArgs).toHaveBeenCalledTimes(1);
		});
		test('Незарегистрированная команда', async () => {
			mockCommandLineArgs.mockReturnValueOnce({
				name: 'test'
			});
			mockCreateError.mockImplementationOnce(() => {
				throw new Error(`Команда с именем 'test' не зарегистриванная`);
			});
			await expect(commander.start()).rejects.toThrow(`Команда с именем 'test' не зарегистриванная`);
		});

		test(`Нет метода 'handle'`, async () => {
			mockCommandLineArgs.mockReturnValueOnce({
				name: 'test'
			});
			mockCreateError.mockImplementationOnce(() => {
				throw new Error(`Отсутствует реализация метода дескриптора`);
			});
			const Constructor = createTestClass('test');

			commander[commanderProperty.commands].set('test', Constructor);
			await expect(commander.start()).rejects.toThrow('Отсутствует реализация метода дескриптора');
		});

		describe('Выполение команды', () => {
			const handle = jest.fn().mockResolvedValue(undefined);
			const Constructor = createTestClass(
				'test',
				// @ts-ignore
				class extends Command {
					handle = handle;
				}
			);
			let command;

			beforeEach(() => {
				command = new Constructor();
				commander[commanderProperty.commands].set('test', command);
				handle.mockReset();
			});
			test('Вывод справки', async () => {
				mockCommandLineArgs.mockReturnValueOnce({
					name: 'test'
				});
				const mockParseOption = jest.spyOn(command, 'parseOption').mockImplementation(() => {
					command[commandNameProperty.options] = {
						help: true
					};
				});
				const mockHelp = jest.spyOn(command, 'help').mockImplementation();

				await commander.start();
				expect(mockCommandLineArgs).toHaveBeenCalledTimes(1);
				expect(mockParseOption).toHaveBeenCalledTimes(1);
				expect(mockHelp).toHaveBeenCalledTimes(1);
				expect(handle).toHaveBeenCalledTimes(0);
			});
			test('Запуск команды', async () => {
				process.argv = ['/usr/local/bin/node', 'test-cli', 'test'];
				mockCommandLineArgs.mockReturnValueOnce({
					name: 'test',
					_unknown: ['--timeout', '1']
				});
				const mockParseOption = jest.spyOn(command, 'parseOption').mockImplementation(() => {
					command[commandNameProperty.options] = {};
				});
				const mockHelp = jest.spyOn(command, 'help').mockImplementation();

				await commander.start();
				expect(mockCommandLineArgs).toHaveBeenCalledTimes(1);
				expect(mockParseOption).toHaveBeenCalledTimes(1);
				expect(mockHelp).toHaveBeenCalledTimes(0);
				expect(handle).toHaveBeenCalledTimes(1);
			});
		});
	});
});
