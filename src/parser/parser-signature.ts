import { OptionDefinition } from 'command-line-args';

/**
 * Класс для парсинга сигнатуры команды и формирования объекта для `command-line-args`
 */
export class ParserSignature {
	/**
	 * @param {string} expression сигнатура команды
	 *
	 * @returns {[string, OptionDefinition[]]} имя команды и объект параметров командной строки
	 */
	static parse(expression: string): [string, OptionDefinition[]] {
		const name = ParserSignature.parseName(expression);
		const matches = [...expression.matchAll(/\{\s*(.*?)\s*\}/g)];

		if (matches.length > 0) {
			return [name, ParserSignature.parseParameters(matches.map(([, token]) => token))];
		}
		return [name, []];
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
	 * @returns {OptionDefinition[]} массив объектов параметров командной строки
	 */
	private static parseParameters(tokens: string[]): OptionDefinition[] {
		const optionDefinitions: OptionDefinition[] = [];

		for (const token of tokens) {
			const matches = /-{2,}(.*)/.exec(token);

			if (matches) {
				optionDefinitions.push(ParserSignature.parseOption(matches[1]));
			}
		}
		return optionDefinitions;
	}

	/**
	 * Парсинг опции
	 *
	 * @param {token} token опция
	 * @returns {OptionDefinition} объект параметров опции
	 */
	private static parseOption(token: string): OptionDefinition {
		try {
			const definition: Partial<OptionDefinition> = {};
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
					definition.defaultValue = mathsDefaultArray[2].split(',');
				} else if (mathsDefaultSingle) {
					[, definition.name, definition.defaultValue] = mathsDefaultSingle;
				} else {
					definition.name = token;
					definition.defaultValue = false;
					definition.type = Boolean;
				}
			}
			return definition as OptionDefinition;
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
		const regexp = /(<([a-z]+)>)\s*/;

		if (regexp.exec(token)) {
			const [, typeString, typeOption] = regexp.exec(token) as RegExpExecArray;

			token = token.replace(typeString, '');
			switch (typeOption) {
				case 'number':
					return [token, Number];
				case null:
				case 'string':
					return [token, String];
				case 'boolean':
					return [token, Boolean];
				default:
					throw new Error(`Unknown type for the ${token} parameter`);
			}
		} else {
			return [token, String];
		}
	}
}
