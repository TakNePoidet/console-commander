// /* eslint-disable no-underscore-dangle */
// import colors, { Color } from 'colors';
// import { table } from 'table';
// // eslint-disable-next-line no-shadow
// export enum TypeOutput {
// 	DEFAULT = 'default',
// 	INFO = 'info',
// 	WARN = 'warn',
// 	ERROR = 'error',
// }

// // eslint-disable-next-line no-shadow
// export enum MethodOutputConsole {
// 	INFO = 'info',
// 	WARN = 'warn',
// 	ERROR = 'error',
// 	PRINT = 'print',
// 	TABLE = 'table',
// }

// export interface ConsoleOutputInterface {
// 	[MethodOutputConsole.INFO](value: string): void;
// 	[MethodOutputConsole.WARN](value: string): void;
// 	[MethodOutputConsole.ERROR](value: string): void;
// 	[MethodOutputConsole.PRINT](value: string): void;
// 	[MethodOutputConsole.TABLE](value: Array<Array<string | number | boolean>>);
// }

// type ColorTheme = Record<TypeOutput, Color[]>;
// /**
//  *
//  */
// export class Output {
// 	private static colorTheme: ColorTheme = {
// 		[TypeOutput.DEFAULT]: [colors.white],
// 		[TypeOutput.INFO]: [colors.blue],
// 		[TypeOutput.WARN]: [colors.yellow],
// 		[TypeOutput.ERROR]: [colors.red]
// 	};

// 	/**
// 	 * @param key
// 	 * @param settings
// 	 */
// 	public static setColor(key: string, ...settings: Array<keyof Color>): void {
// 		Output.colorTheme[key] = settings;
// 	}

// 	/**
// 	 * Вывод информационного сообщения
// 	 *
// 	 * @param {string} value сообщения
// 	 * @returns {void}
// 	 */
// 	public static [MethodOutputConsole.INFO](value: string): void {
// 		Output._print(Output.formatting(TypeOutput.INFO, value));
// 		// Output.newLine();
// 	}

// 	/**
// 	 * Вывод ошибки
// 	 *
// 	 * @param {string} value текст ошибки
// 	 * @returns {void}
// 	 */
// 	public static error(value: string): void {
// 		Output._print(Output.formatting(TypeOutput.ERROR, value));
// 		// Output.newLine();
// 	}

// 	/**
// 	 * Вывод предупреждения
// 	 *
// 	 * @param {string} value текст предупреждения
// 	 * @returns {void}
// 	 */
// 	public static warn(value: string): void {
// 		Output._print(Output.formatting(TypeOutput.WARN, value));
// 		// Output.newLine();
// 	}

// 	/**
// 	 * Вывод таблицы в консоль
// 	 *
// 	 * @param {(string | number | boolean)[][]} value таблица
// 	 * @returns {void}
// 	 */
// 	public static table(value: (string | number | boolean)[][]): void {
// 		Output._print(table(value).trimEnd());
// 		// Output.newLine();
// 	}

// 	/**
// 	 * Вывод пустых строк
// 	 *
// 	 * @param {number} [count=1] количество новых строк
// 	 * @returns {void}
// 	 */
// 	public static newLine(count = 1): void {
// 		for (let index = 0; index < count; index = +1) {
// 			Output._print(`\n`);
// 		}
// 	}

// 	/**
// 	 * Печатает строку в консоль
// 	 *
// 	 * @param {any} value - выводимая строка
// 	 * @returns {void}
// 	 */
// 	public static print(value: any): void {
// 		Output._print(value);
// 		// Output.newLine();
// 	}

// 	/**
// 	 * Печатает строку в консоль
// 	 *
// 	 * @private
// 	 * @param {any} value - выводимая строка
// 	 * @returns {void}
// 	 */
// 	private static _print(value: any): void {
// 		// switch (typeof value) {
// 		// 	case 'object':
// 		// 		value = JSON.stringify(value, null, 2);
// 		// 		break;
// 		// 	default:
// 		// 		value = value.toString();
// 		// 		break;
// 		// }
// 		// process.stdout.write(value);

// 		console.log(value);
// 	}

// 	/**
// 	 * Форматирование строки в зависимости от типа вывода
// 	 *
// 	 * @param {TypeOutput} key  тип выводимого сообщения
// 	 * @param {string} value сообщение
// 	 * @returns {string}
// 	 */
// 	private static formatting(key: TypeOutput, value: string): string {
// 		return Output.colorTheme[key].reduce((prev, current) => current(prev), value);
// 	}
// }
