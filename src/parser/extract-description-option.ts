import { createError } from '../error';

/**
 * Получение описания опции
 *
 * @param {string} token - строка содержащая опуию
 * @returns {string[]} - мессив занчений где певрое это опция, а второе ее описание
 */
export function extractDescriptionOption(token: string): string[] | never {
	if (!token) {
		createError('Непередан токен');
	}

	const regExp = /(<([a-zA-z0-9]+)>)?[a-z0-9-]+(\*?=(.*)|\*)?$/;
	const parts = token.split(/\s+:\s+/);

	if (parts.length === 2 && regExp.exec(parts[0])) {
		return parts;
	}
	if (regExp.exec(token)) {
		return [token, ''];
	}
	return createError('Невалидный формат описания опции');
}
