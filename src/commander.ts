import commandLineArgs, { CommandLineOptions } from 'command-line-args';
import { CommandConstructor, CommandPrivateApi } from './interface';
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
			const [name, optionDefinitions] = ParserSignature.parse(instance.signature);

			instance.optionDefinition = optionDefinitions;
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
				const mainDefinitions = [{ name: 'name', defaultOption: true }];
				const mainCommand: CommandLineOptions & { name?: string } = commandLineArgs(mainDefinitions, {
					stopAtFirstUnknown: true
				});

				if (!mainCommand.name) {
					reject(new Error('Enter the name of the command'));
				}
				if (!mainCommand.name || !this.commands.has(mainCommand.name)) {
					reject(new Error(`${mainCommand.name} command not found among registered commands`));
				}
				const command = this.commands.get(mainCommand.name as string) as CommandPrivateApi;

				// eslint-disable-next-line no-underscore-dangle
				command.parseOption(mainCommand._unknown || []);
				if (typeof command.handle !== 'function') {
					throw new Error('Missing implementation of the handle method');
				}
				Promise.resolve(command.handle())
					.then((result: any) => {
						resolve(result);
					})
					.then((error) => {
						reject(error);
					});
			} catch (error) {
				reject(error);
			}
		});
	}
}
