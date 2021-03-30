/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import colors, { Color } from 'colors';
import { table as printTable } from 'table';
// eslint-disable-next-line no-shadow
export enum TypeOutput {
	DEFAULT = 'default',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error'
}
type ColorTheme = Record<TypeOutput, Color[]>;
const colorTheme: ColorTheme = {
	[TypeOutput.DEFAULT]: [colors.white],
	[TypeOutput.INFO]: [colors.blue],
	[TypeOutput.WARN]: [colors.yellow],
	[TypeOutput.ERROR]: [colors.red]
};

/**
 * Форматирование строки в зависимости от типа вывода
 *
 * @param {TypeOutput} key  тип выводимого сообщения
 * @param {string} value сообщение
 * @returns {string}
 */
function formatting(key: TypeOutput, value: string): string {
	return colorTheme[key].reduce((prev, current) => current(prev), value);
}

/**
 * Печатает строку в консоль
 *
 * @param {any} value - выводимая строка
 * @param {TypeOutput} key  тип выводимого сообщения
 * @returns {void}
 */
export function print(value: any, key: TypeOutput = TypeOutput.DEFAULT): void {
	let string = formatting(key, value);

	switch (typeof string) {
		case 'object':
			string = JSON.stringify(string, null, 2);
			break;
		default:
			string = string.toString();
			break;
	}
	process.stdout.write(`${string}\n`);
}

/**
 * Вывод информационного сообщения
 *
 * @param {string} value сообщения
 * @returns {void}
 */
export function info(value: string): void {
	print(value, TypeOutput.INFO);
}

/**
 * Вывод ошибки
 *
 * @param {string} value текст ошибки
 * @returns {void}
 */
export function error(value: string): void {
	print(value, TypeOutput.ERROR);
}

/**
 * Вывод предупреждения
 *
 * @param {string} value текст предупреждения
 * @returns {void}
 */
export function warn(value: string): void {
	print(value, TypeOutput.WARN);
}

/**
 * Вывод таблицы в консоль
 *
 * @param {(string | number | boolean)[][]} value таблица
 * @returns {void}
 */
export function table(value: (string | number | boolean)[][]): void {
	print(printTable(value).trimEnd());
}
