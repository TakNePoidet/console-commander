import { createError } from '../../error';

/**
 * Получение типа опции
 *
 * @param {string} token - строка содержащая опуию
 * @returns {[string, Function]} - массив со значениями:
 * 	1) опция
 * 	2) функция конструктор типа значения опции
 */
export function extractTypeOption(
	token: string
): [string, NumberConstructor | StringConstructor | BooleanConstructor] | never {
	const regexp = /^(<(?<type>[a-zA-z0-9]+)>)?(([a-z0-9-]+)(\*?=(.*)|\*)?)$/;

	if (!token) {
		return createError('Непередан токен');
	}
	let newToken: string;

	if (regexp.exec(token)) {
		const { type } = regexp.exec(token).groups;

		newToken = token.replace(`<${type}>`, '');
		switch (type.toLocaleLowerCase()) {
			case 'number':
				return [newToken, Number];
			case 'string':
				return [newToken, String];
			case 'boolean':
				return [newToken, Boolean];
			default:
				return createError(`Неизвестный тип для параметра ${newToken}`);
		}
	} else {
		return createError('Неверный формат токена');
	}
}
