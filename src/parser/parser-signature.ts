import { OptionDefinition } from 'command-line-args';
import { OptionDescription, OptionDescriptions } from '../interface/command';

/**
 * Класс для парсинга сигнатуры команды и формирования объекта для `command-line-args`
 */
export class ParserSignature {
	/**
	 * @param {string} expression сигнатура команды
	 *
	 * @returns {[string, OptionDefinition[]]} имя команды, объект параметров командной строки, описание опций командной строки
	 */
	static parse(expression: string): [string, OptionDefinition[], OptionDescriptions] {
		const name = ParserSignature.parseName(expression);
		const matches = [...expression.matchAll(/\{\s*(.*?)\s*\}/g)];

		if (matches.length > 0) {
			return [name, ...ParserSignature.parseParameters(matches.map(([, token]) => token))];
		}
		return [name, [], {}];
	}

	/**
	 * Получение имени команды
	 *
	 * @param {string} expression сигнатура команды
	 * @returns {string} имя команды
	 */
	private static parseName(expression: string): string {
		const matches = /[^\s]+/.exec(expression);

		if (matches) {
			return matches[0];
		}
		throw new Error('Unable to determine command name from signature.');
	}

	/**
	 * Парсинг аргументов командной строки
	 *
	 * @param {string[]} tokens массив аргументов командной строки
	 * @returns {[OptionDefinition[],OptionDescriptions]} массив объектов параметров командной строки и описание опций команд
	 */
	private static parseParameters(tokens: string[]): [OptionDefinition[], OptionDescriptions] {
		const optionDefinitions: OptionDefinition[] = [];
		const optionDescriptions: OptionDescriptions = {};

		for (const token of tokens) {
			const matches = /-{2,}(.*)/.exec(token);

			if (matches) {
				const [definitions, description] = ParserSignature.parseOption(matches[1]);

				optionDefinitions.push(definitions);
				optionDescriptions[definitions.name] = description;
			}
		}
		return [optionDefinitions, optionDescriptions];
	}

	/**
	 * Парсинг опции
	 *
	 * @param {token} token опция
	 * @returns {[OptionDefinition, string]} объект параметров опции и описание
	 */
	private static parseOption(token: string): [OptionDefinition, OptionDescription] {
		try {
			const definition: Partial<OptionDefinition> = {};
			let description = '';

			[token, description] = ParserSignature.extractDescription(token);
			let alias = null;

			[token] = token.split(/\s+:\s+/);
			if (/\s*\|\s*/.exec(token) !== null) {
				[alias, token] = token.split(/\s*\|\s*/);
				definition.alias = alias;
			}
			[token, definition.type] = ParserSignature.typeOption(token);

			if (token.endsWith('*')) {
				definition.name = token.slice(0, -1);
				definition.multiple = true;
				definition.defaultValue = [];
			} else if (token.endsWith('*=')) {
				definition.name = token.slice(0, -2);
				definition.multiple = true;
				definition.defaultValue = [];
			} else if (token.endsWith('=')) {
				definition.name = token.slice(0, -1);
				definition.defaultValue = [];
			} else {
				const mathsDefaultArray = token.match(/(.+)\*\=(.+)/);
				const mathsDefaultSingle = token.match(/(.+)\=(.+)/);

				if (mathsDefaultArray) {
					definition.multiple = true;
					[, definition.name] = mathsDefaultArray;
					definition.defaultValue = mathsDefaultArray[2].split(',').map((value) => definition.type(value));
				} else if (mathsDefaultSingle) {
					[, definition.name, definition.defaultValue] = mathsDefaultSingle;
					definition.defaultValue = definition.type(definition.defaultValue);
				} else {
					definition.name = token;
					definition.defaultValue = false;
					definition.type = Boolean;
				}
			}
			return [definition as OptionDefinition, description];
		} catch (error) {
			throw new Error(error.message);
		}
	}

	/**
	 * Получение типа опции
	 *
	 * @param {string} token опция
	 * @returns {[string, Function]} имя опции и её тип
	 */
	private static typeOption(token: string): [string, NumberConstructor | StringConstructor | BooleanConstructor] {
		const regexp = /(<([a-zA-z0-9]+)>)\s*/;

		if (regexp.exec(token)) {
			const [, typeString, typeOption] = regexp.exec(token) as RegExpExecArray;

			token = token.replace(typeString, '');
			switch (typeOption.toLocaleLowerCase()) {
				case 'number':
					return [token, Number];
				case null:
				case 'string':
					return [token, String];
				default:
					throw new Error(`Unknown type for the ${token} parameter`);
			}
		} else {
			return [token, String];
		}
	}

	/**
	 * Получение описания опции
	 *
	 * @param {string} token опция
	 * @returns {string[]} имя опции и её описание
	 */
	private static extractDescription(token: string): string[] {
		const parts = token.split(/\s+:\s+/);

		return parts.length === 2 ? parts : [token, ''];
	}
}
