import commandLineArgs, { CommandLineOptions, OptionDefinition } from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Console } from '../console';
import { OptionDescriptions } from '../interface';

/**
 * Базовый класс команды
 *
 * @augments Console
 */
export abstract class Command extends Console {
	/**
	 * Имя команды
	 */
	protected commandName = '';

	/**
	 * Приватный массив параметров для `command-line-args`
	 *
	 * @type {OptionDefinition[]}
	 */
	private _optionDefinition: OptionDefinition[] = [];

	/**
	 *
	 * Объект с опциями команды
	 */
	public options: CommandLineOptions = {};

	/**
	 *
	 * Объект с описанием опций команды
	 */
	private optionDescriptions: OptionDescriptions = {};

	/**
	 * Массив параметров для `command-line-args`
	 *
	 * @type {OptionDefinition[]}
	 * @returns {OptionDefinition[]}
	 */
	private get optionDefinition(): OptionDefinition[] {
		return this._optionDefinition;
	}

	/**
	 * @param {OptionDefinition[]} value - Массив параметров для `command-line-args`
	 */
	private set optionDefinition(value: OptionDefinition[]) {
		this._optionDefinition = value;
	}

	/**
	 * Парсинг параметров командной строки  и запись в опции команды
	 *
	 * @param {CommandLineOptions} globalOption - глобальные опции
	 * @param {string[]} argv - массив командной строки
	 * @returns {void}
	 */
	private parseOption(globalOption: CommandLineOptions, argv: string[]): void {
		const optionDefinition = [...this._optionDefinition];

		if (optionDefinition.findIndex(({ name }) => name === 'help') === -1) {
			optionDefinition.push({
				name: 'help',
				alias: 'H',
				type: Boolean,
				defaultValue: false
			});
		}
		this.options = {
			...commandLineArgs(optionDefinition, { argv, stopAtFirstUnknown: false }),
			...globalOption
		};
	}

	public abstract signature: string;

	public abstract description: string;

	public abstract handle(): any | Promise<any>;

	/**
	 *Вывод справки
	 */
	protected help(): void {
		const optionList = this.optionDefinition.map(({ name, alias, type }) => ({
			name,
			alias,
			type,
			description: this.optionDescriptions[name] || ''
		}));
		const sections = [
			{
				header: 'Command description',
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

		console.log(commandLineUsage(sections));
	}
}
