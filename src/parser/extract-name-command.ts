import { createError } from '../error';

/**
 * Получение имени команды
 *
 * @param {string} expression - сигнатура команды
 * @returns {string} - имя команды
 */
export function extractNameCommand(expression: string): string | never {
	if (expression) {
		const matches = /^[A-Za-z][A-Za-z0-9-]+/.exec(expression.toString());

		if (matches) {
			return matches[0];
		}
	}
	return createError('Невозможно определить имя команды');
}
