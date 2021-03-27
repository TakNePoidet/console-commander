import colors from 'colors';

/**
 * Класс реализующий работу с консолью
 *
 * @class
 */
export class Console {
	/**
	 * Вывод информации в консоль
	 *
	 * @param {string} value Выводимое значение
	 * @returns {this} возвращает инстанс реализующего класса
	 */
	public info(value: string): this {
		process.stdout.write(colors.blue(value));
		this.newLine();
		return this;
	}

	/**
	 * Вывод ошибки в консоль
	 *
	 * @param {string} value Выводимое значение
	 * @returns {this} возвращает инстанс реализующего класса
	 */
	public error(value: string): this {
		process.stdout.write(colors.red(value));
		this.newLine();
		return this;
	}

	/**
	 * Вывод предупреждения в консоль
	 *
	 * @param {string} value Выводимое значение
	 * @returns {this} возвращает инстанс реализующего класса
	 */
	public warn(value: string): this {
		process.stdout.write(colors.yellow(value));
		this.newLine();
		return this;
	}

	/**
	 * Вывод значения с новой строки и без оформления
	 *
	 * @param {string} value Выводимое значение
	 * @returns {this} возвращает инстанс реализующего класса
	 */
	public line(value: string): this {
		process.stdout.write(`${value}`);
		this.newLine();
		return this;
	}

	/**
	 * Вывод пустых строк
	 *
	 * @param {number} [count=1] количество новых строк
	 * @returns {this} возвращает инстанс себя
	 */
	public newLine(count = 1): this {
		for (let index = 0; index < count; index = +1) {
			process.stdout.write(`\n`);
		}
		return this;
	}
}
