import commandLineArgs, { CommandLineOptions } from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Definition, EmptyObject } from '../types';

export interface CommandOption extends Record<string, any> {
	help: boolean;
}

export interface CommandPrivate {
	signature: string;
	commandName: string;
	description: string;
	definitions: Definition[];
	handle: () => Promise<void>;
	parseOption: (globalOption: CommandLineOptions, argv: string[]) => void;
	options: Record<string, any>;
	help: () => void;
}

export type CommandConstructor<C extends Command = Command> = { new (): C };

export abstract class Command<O extends EmptyObject = EmptyObject> {
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
	 * Настройки для парсинга опций командной строки
	 *
	 * @type {Definition[]}
	 * @protected
	 */
	private definitions: Definition[];

	/**
	 * Опции полученные из командной строки
	 *
	 * @type {CommandOption}
	 * @protected
	 */
	protected options: O & CommandOption;

	/**
	 * Основная функция команды
	 *
	 * @returns  {Promise<void> | void}
	 */
	public abstract handle(): Promise<void> | void;

	/**
	 * Парсинг опций командной строки
	 *
	 * @param {CommandLineOptions} globalOption - глобальные опции
	 * @param {string[]} argv - параметры командной
	 * @returns {void}
	 * @private
	 */
	private parseOption(globalOption: CommandLineOptions, argv: string[]): void {
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
			...commandLineArgs(optionDefinition, { argv, stopAtFirstUnknown: true }),
			...globalOption
		} as O & CommandOption;
	}

	/**
	 * Формирование справки
	 *
	 * @returns {void}
	 * @private
	 */
	private help(): void {
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
				header: 'Пример',
				content: `$ app ${this.commandName} <options>`
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
					...optionList
				]
			}
		];

		console.log(commandLineUsage(sections));
	}
}
