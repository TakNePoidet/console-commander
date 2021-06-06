/**
 * @param {string} error - текст ошибки
 */
export function createError(error: string | Error): never {
	if (error instanceof Error) {
		throw error;
	}
	if (typeof error === 'string') {
		throw new Error(error);
	}
	throw new Error('Неизвесная ошибка');
}
