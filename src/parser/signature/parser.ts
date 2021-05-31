import { Definition } from '../../types';
import { extractNameCommand } from './extract-name-command';
import { extractOptions } from './extract-options';

/**
 * Парсинг сигнатуры команды
 *
 * @param {string} expression - сигнатура команды
 * @returns {[string, Definition[]]} - имя команды и настройки опций
 */
export function parse(expression: string): [string, Definition[]] {
	const name = extractNameCommand(expression);
	const matches = [...expression.matchAll(/\{\s*(.*?)\s*\}/g)];

	if (matches.length > 0) {
		return [name, extractOptions(matches.map(([, token]) => token))];
	}
	return [name, []];
}
