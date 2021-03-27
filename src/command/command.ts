import commandLineArgs, { CommandLineOptions, OptionDefinition } from 'command-line-args';
import { Console } from '../console';

/**
 * Базовый класс команды
 *
 * @augments Console
 */
export abstract class Command extends Console {
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
	 * @param {string[]} argv - массив командной строки
	 * @returns {void}
	 */
	private parseOption(argv: string[]): void {
		this.options = commandLineArgs(this._optionDefinition, { argv, stopAtFirstUnknown: false });
	}

	public abstract handle(): any | Promise<any>;

	public abstract signature: string;
}
