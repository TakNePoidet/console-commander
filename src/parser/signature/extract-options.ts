import { Definition } from '../../types';
import { extractOption } from './extract-option';

/**
 * Получение настроек опций
 *
 * @param {string[]} tokens - массив строк с опциями
 * @returns {Definition[]} - массив настроек опций
 */
export function extractOptions(tokens: string[]): Definition[] {
	const definitions: Definition[] = [];

	for (const token of tokens) {
		const matches = /-{2,}(.*)/.exec(token);

		if (matches) {
			const description = extractOption(matches[1]);

			definitions.push(description);
		}
	}
	return definitions;
}
