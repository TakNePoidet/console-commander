export interface CommandPublicApi {
	/**
	 * Сигнатура команды
	 *
	 * @type {string}
	 */
	signature: string;

	/**
	 * Функция вызываемая для обработки команды
	 */
	handle(): any | Promise<any>;
}
