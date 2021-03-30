import colors, { Color } from 'colors';

// eslint-disable-next-line no-shadow
export enum TypeOutput {
	DEFAULT = 'default',
	INFO = 'info',
	WARN = 'warn',
	ERROR = 'error'
}
type ColorTheme = Record<TypeOutput, Color[]>;

/**
 *
 */
export class Print {
	private static colorTheme: ColorTheme = {
		[TypeOutput.DEFAULT]: [colors.white],
		[TypeOutput.INFO]: [colors.blue],
		[TypeOutput.WARN]: [colors.yellow],
		[TypeOutput.ERROR]: [colors.red]
	};

	/**
	 * @param {string} key Ключ типа сообщения
	 * @param {...any} settings настройки форматирования вывода
	 */
	public static setColor(key: string, ...settings: Array<keyof Color>): void {
		Print.colorTheme[key] = settings;
	}

	/**
	 * Конструктор
	 *
	 * @param {any} string сообщение
	 * @param {TypeOutput} key Ключ типа сообщения
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	constructor(string: any, key: TypeOutput = TypeOutput.DEFAULT) {
		let formatting = this.formatting(key, string);

		switch (typeof formatting) {
			case 'object':
				formatting = JSON.stringify(formatting, null, 2);
				break;
			default:
				formatting = formatting.toString();
				break;
		}
		process.stdout.write(`${formatting}\n`);
	}

	/**
	 * Форматирование строки в зависимости от типа вывода
	 *
	 * @param {TypeOutput} key  тип выводимого сообщения
	 * @param {string} value сообщение
	 * @returns {string}
	 */
	private formatting(key: TypeOutput, value: string): string {
		return Print.colorTheme[key].reduce((prev, current) => current(prev), value);
	}
}

/**
 * @param {...any} args массив аргументов функции
 */
export function setColorPrint(...args: any[]): void {
	Print.setColor.apply({}, args);
}
