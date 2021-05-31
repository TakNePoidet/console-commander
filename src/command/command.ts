import commandLineArgs, { CommandLineOptions } from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Definition } from '../types';

export interface CommandOption extends Record<string, any> {
	help: boolean;
}

export interface CommandPrivate {
	signature: string;
	commandName: string;
	definitions: Definition[];
	handle: Promise<void>;
}

export type CommandConstructor<C extends Command = Command> = { new (): C };

export abstract class Command<O = CommandOption> {
	/**
	 * Имя команды
	 *
	 * @type {string}
	 * @protected
	 */
	protected commandName: string;

	/**
	 * Сигнатура команды
	 *
	 * @type {string}
	 */
	public abstract signature: string;

	/**
	 * Описание команды
	 *
	 * @type {string}
	 */
	public abstract description: string;

	/**
	 * Настройки для парсигна опций командной строки
	 *
	 * @type {Definition[]}
	 * @protected
	 */
	protected definitions: Definition[];

	/**
	 * Опции полученные из командной строки
	 *
	 * @type {CommandOption}
	 * @protected
	 */
	protected options: O;

	/**
	 * Основная функция команды
	 *
	 * @returns  {Promise<void> | void}
	 */
	public abstract handle(): Promise<void> | void;

	/**
	 * Парсиг опкий командной строки
	 *
	 * @param {CommandLineOptions} globalOption - глобальные опции
	 * @param {string[]} argv - параметры командной
	 * @returns {void}
	 * @protected
	 */
	protected parseOption(globalOption: CommandLineOptions, argv: string[]): void {
		const optionDefinition = [...this.definitions];

		if (optionDefinition.findIndex(({ name }) => name === 'help') === -1) {
			optionDefinition.push({
				name: 'help',
				alias: 'H',
				type: Boolean,
				defaultValue: false,
				description: 'Вызов справки'
			});
		}

		this.options = {
			...commandLineArgs(optionDefinition, { argv, stopAtFirstUnknown: false }),
			...globalOption
		} as O;
	}

	protected help(): string {
		const optionList = this.definitions.map((definition) => {
			const { name, alias, type, description } = definition;

			return {
				name,
				alias,
				type,
				description
			};
		});
		const sections = [
			{
				header: 'Описание команды',
				content: this.description
			},
			{
				header: 'Synopsis',
				content: `$ app ${this.commandName} <options>`
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
					...optionList
				]
			}
		];

		return commandLineUsage(sections);
	}
}
