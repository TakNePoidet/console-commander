import commandLineArgs, { CommandLineOptions, OptionDefinition } from 'command-line-args';
import { Command, CommandConstructor, CommandPrivate } from './command';
import { createError } from './error';
import { parse } from './parser';

export class Manager {
	private commands = new Map<string, CommandPrivate>();

	/**
	 * Регистрация команд
	 *
	 * @param {...CommandConstructor} commands - клсссы команд
	 * @returns {this} - Manager
	 */
	public use(...commands: CommandConstructor[]): this {
		if (commands.length < 1) {
			return createError('не передеаны команды для регистрции');
		}
		commands.forEach(this.registration);
		return this;
	}

	/**
	 * Регистрация команды
	 *
	 * @param {CommandConstructor} Constructor - конструктор команды
	 * @returns {void}
	 */
	private registration(Constructor): void {
		const instance = new Constructor();

		if (!(instance instanceof Command)) {
			return createError('Команда не является инстансом базового класса `Command`');
		}

		const instancePrivate = instance as unknown as CommandPrivate;
		const [name, definitions] = parse(instance.signature);

		if (typeof instancePrivate.signature !== 'string') {
			return createError('Отсутствует сигнатура команды');
		}

		instancePrivate.commandName = name;
		instancePrivate.definition = [...definitions];
		this.commands.set(name, instancePrivate);
	}

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

				const mainCommand: CommandLineOptions & { name?: string } = commandLineArgs(mainDefinitions, {
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

				const command = this.commands.get(mainCommand.name as string) as CommandPrivate;
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
}
