import commandLineArgs, { CommandLineOptions, OptionDefinition } from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { table } from 'table';
import { CommandConstructor, CommandDescription, CommandPrivateApi } from './interface';
import { ParserSignature } from './parser';
/**
 *
 */
export class Commander {
	private commands = new Map<string, CommandPrivateApi>();

	/**
	 * Регистрация команд в менеджере
	 *
	 * @param {...CommandConstructor} commands - массив конструкторов класса команд
	 * @returns {this} Commander
	 */
	public registration(...commands: CommandConstructor[]): Commander {
		commands.forEach((Instance) => {
			const instance = new Instance() as CommandPrivateApi;

			if (typeof instance.signature !== 'string') {
				throw new Error('Missing command signature');
			}
			const [name, optionDefinitions, optionDescriptions] = ParserSignature.parse(instance.signature);

			instance.commandName = name;
			instance.optionDefinition = [...optionDefinitions];
			instance.optionDescriptions = optionDescriptions;
			this.commands.set(name, instance);
		});
		return this;
	}

	/**
	 * Функция запуска команд
	 */
	public start(): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				const mainDefinitions: OptionDefinition[] = [
					{ name: 'name', defaultOption: true },
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

				const mainCommand: CommandLineOptions & { name?: string; } = commandLineArgs(mainDefinitions, {
					stopAtFirstUnknown: true
				});

				if (!mainCommand.name) {
					switch (true) {
						case mainCommand.list:
							this.printListCommand();
							resolve();
							break;
						case mainCommand.help:
							this.help();
							resolve();
							break;
						default:

							break;
					}
					reject(new Error('Enter the name of the command'));
				}
				if (!mainCommand.name || !this.commands.has(mainCommand.name)) {
					reject(new Error(`${mainCommand.name} command not found among registered commands`));
				}

				const command = this.commands.get(mainCommand.name as string) as CommandPrivateApi;
				const argv = new Set(process.argv.slice(3));

				// eslint-disable-next-line no-underscore-dangle
				[...(mainCommand._unknown ?? [])].forEach((value) => argv.add(value));

				command.parseOption({} as CommandLineOptions, Array.from(argv));
				if (typeof command.handle !== 'function') {
					throw new Error('Missing implementation of the handle method');
				}

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
	 * @returns {CommandDescription[]}
	 */
	private getListCommand(): CommandDescription[] {
		return [...this.commands.entries()].map(([name, instance]) => ({
			name,
			summary: instance.description
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
	 *Вывод справки
	 */
	private help(): void {
		const sections = [
			{
				header: 'Commander options',
				optionList: [
					{
						name: 'help',
						description: 'Show the user manual',
						alias: 'H',
						type: Boolean
					},
					{
						name: 'list',
						description: 'Displays a list of available commands',
						alias: 'L',
						type: Boolean
					}
				]
			},
			{
				header: 'Synopsis',
				content: '$ example <command> <options>'
			},
			{
				header: 'Available commands',
				content: this.getListCommand()
			}
		];

		console.log(commandLineUsage(sections));
	}
}
