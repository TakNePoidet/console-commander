export interface CommandPublicApi {
	/**
	 * Сигнатура команды
	 *
	 * @type {string}
	 */
	signature: string;

	/**
	 * Описание команды
	 *
	 * @type {string}
	 */
	description: string;

	/**
	 * Функция вызываемая для обработки команды
	 */
	handle(): any | Promise<any>;
}
