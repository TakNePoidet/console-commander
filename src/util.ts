/**
 * Конвертирование в boolean значение
 *
 * @param {any} value - исходное значение
 * @returns {boolean} - конвертированное значение
 */
export function convertBoolean(value: string | boolean | number): boolean {
	switch (value) {
		case true:
		case '1':
		case 'true':
			return true;
		case false:
		case '0':
		case 'false':
			return false;
		default:
			return false;
	}
}

/**
 * Присваивание значения по умолчанию с нужным типом
 *
 * @param {any} value - исходное значение
 * @param {NumberConstructor | StringConstructor | BooleanConstructor} type - функция конструктор примитивного типа
 * @returns {any} - сконвертированное значение
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setValueOfType(value: any, type: NumberConstructor | StringConstructor | BooleanConstructor): any {
	if (type === Boolean) {
		return convertBoolean(value);
	}
	return type(value);
}

/**
 * Присваивание значения по умолчанию с нужным типом в массиве
 *
 * @param {any[]} values - массив исходных значений
 * @param {NumberConstructor | StringConstructor | BooleanConstructor} type - функция конструктор примитивного типа
 * @returns {any[]} - сконвертированный массив
 */
export function setValuesOfType(
	values: any[],
	type: NumberConstructor | StringConstructor | BooleanConstructor
): any[] {
	return values.map((value) => setValueOfType(value, type));
}

export const Truthy = [1, true, '1', 'true'];
export const Falsy = [0, false, '0', 'false'];
