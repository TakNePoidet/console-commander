import { bold } from 'chalk';
import commandLineArgs, { CommandLineOptions, OptionDefinition } from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { table } from 'table';
import { Command, CommandConstructor, CommandPrivate } from './command';
import { createError } from './error';
import { parser } from './parser';
import { CommandDescription } from './types';

export class Commander {
	private commands = new Map<string, CommandPrivate>();

	/**
	 * Регистрация команд
	 *
	 * @param {...CommandConstructor} commands - классы команд
	 * @returns {this} - Manager
	 */
	public append(...commands: CommandConstructor[]): this {
		if (commands.length < 1) {
			return createError('Не переданы команды для регистрации');
		}
		commands.forEach((Constructor) => {
			this.registration(Constructor);
		});
		return this;
	}

	/**
	 * Регистрация команды
	 *
	 * @param {CommandConstructor} Constructor - конструктор команды
	 * @returns {void}
	 */
	private registration(Constructor): void {
		if (typeof Constructor !== 'function') {
			return createError('Команда не является функцией конструктором');
		}
		const instance = new Constructor();

		if (!(instance instanceof Command)) {
			return createError('Команда не является инстансом базового класса `Command`');
		}

		const instancePrivate = instance as unknown as CommandPrivate;

		if (typeof instancePrivate.signature !== 'string') {
			return createError('Отсутствует сигнатура команды');
		}

		if (typeof instancePrivate.handle !== 'function') {
			return createError('Отсутствует реализация метода дескриптора');
		}

		const [name, definitions] = parser(instancePrivate.signature);

		instancePrivate.commandName = name;
		instancePrivate.definitions = definitions;
		this.commands.set(name, instancePrivate);
	}

	/**
	 * Запуск команд
	 *
	 * @returns {Promise<void>}
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				const mainDefinitions: OptionDefinition[] = [{ name: 'nameGeneralCommand', defaultOption: true }];

				const mainCommand: CommandLineOptions & { nameGeneralCommand?: string } = commandLineArgs(mainDefinitions, {
					stopAtFirstUnknown: true
				});

				if (!mainCommand.nameGeneralCommand) {
					const mainDefinitionsOptions = [
						{
							name: 'list',
							alias: 'L',
							type: Boolean,
							defaultValue: false
						},
						{
							name: 'help',
							alias: 'H',
							type: Boolean,
							defaultValue: false
						}
					];

					// eslint-disable-next-line no-underscore-dangle
					const argv = mainCommand._unknown || [];
					const mainOptions = commandLineArgs(mainDefinitionsOptions, { argv, stopAtFirstUnknown: true });

					switch (true) {
						case mainOptions.list:
							this.printListCommand();
							resolve();
							break;
						case mainOptions.help:
							this.printHelp();
							resolve();
							break;
						default:
							reject(new Error('Введите имя команды'));
							break;
					}
				}

				if (!mainCommand.nameGeneralCommand || !this.commands.has(mainCommand.nameGeneralCommand)) {
					createError(`Команда с именем '${bold(mainCommand.nameGeneralCommand)}' не зарегистрирована`);
				}
				const command = this.commands.get(mainCommand.nameGeneralCommand as string) as CommandPrivate;

				// eslint-disable-next-line no-underscore-dangle
				const argv = mainCommand._unknown || [];

				command.parseOption({} as CommandLineOptions, argv);

				switch (true) {
					case command.options.help:
						command.help();
						resolve();
						break;
					default:
						Promise.resolve(command.handle())
							.then((result: any) => {
								resolve(result);
							})
							.then((error) => {
								reject(error);
							});
				}
			} catch (error) {
				reject(error);
			}
		});
	}

	/**
	 * Получение списка доступных команд
	 *
	 * @private
	 * @returns {CommandDescription[]} - список команд и их описания
	 */
	private getListCommand(): CommandDescription[] {
		return Array.from<CommandPrivate>(this.commands.values()).map((command) => ({
			name: command.commandName,
			summary: command.description
		}));
	}

	/**
	 * Вывод списка доступных команд
	 *
	 * @returns {void}
	 */
	private printListCommand(): void {
		const data = this.getListCommand().map(({ name, summary }, index) => [index + 1, name, summary]);

		console.log(table(data));
	}

	/**
	 * Вывод справки
	 *
	 * @private
	 * @returns {void}
	 */
	private printHelp(): void {
		const sections = [
			{
				header: 'Опции менеджера',
				optionList: [
					{
						name: 'help',
						description: 'Вывод справки',
						alias: 'H',
						type: Boolean
					},
					{
						name: 'list',
						description: 'Вывод на экран списка команд',
						alias: 'L',
						type: Boolean
					}
				]
			},
			{
				header: 'Пример',
				content: '$ example <command> <options>'
			},
			{
				header: 'Доступные команды',
				content: this.getListCommand()
			}
		];

		console.log(commandLineUsage(sections));
	}
}
