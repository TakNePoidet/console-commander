import { Definition } from '../types';
import { setValueOfType, setValuesOfType } from '../util';
import { createError } from '../error';
import { extractDescriptionOption } from './extract-description-option';
import { extractTypeOption } from './extract-type-option';

/**
 * Получение настроек одной опции
 *
 * @param {string} token - строка содержащая опуию
 * @returns {Definition} - настройка опции
 */
export function extractOption(token: string): Definition | never {
	if (!token) {
		createError('Непередан токен');
	}
	try {
		const definition: Partial<Definition> = {
			multiple: false,
			defaultValue: false
		};
		let newToken: string;

		[newToken, definition.description] = extractDescriptionOption(token);
		let alias = null;

		[newToken] = newToken.split(/\s+:\s+/);
		if (/\s*\|\s*/.exec(newToken) !== null) {
			[alias, newToken] = newToken.split(/\s*\|\s*/);
			definition.alias = alias;
		}

		[newToken, definition.type] = extractTypeOption(newToken);

		if (newToken.endsWith('*')) {
			definition.name = newToken.slice(0, -1);
			definition.multiple = true;
			definition.type = definition.type === Boolean ? String : definition.type;
			definition.defaultValue = [];
		} else if (newToken.endsWith('*=')) {
			definition.name = newToken.slice(0, -2);
			definition.multiple = true;
			definition.type = definition.type === Boolean ? String : definition.type;
			definition.defaultValue = [];
		} else if (newToken.endsWith('=')) {
			definition.type = definition.type === Boolean ? String : definition.type;
			definition.name = newToken.slice(0, -1);
			definition.defaultValue = null;
		} else {
			const mathsDefaultArray = newToken.match(/(.+)\*\=(.+)/);
			const mathsDefaultSingle = newToken.match(/(.+)\=(.+)/);

			if (mathsDefaultArray) {
				definition.multiple = true;
				const defaultValues = mathsDefaultArray[2].split(',');

				if (definition.type === Boolean) {
					if (['true', 'false'].includes(defaultValues[0])) {
						definition.defaultValue = setValuesOfType(defaultValues, Boolean);
					} else {
						definition.type = String;
						definition.defaultValue = setValuesOfType(defaultValues, String);
					}
				} else {
					definition.defaultValue = setValuesOfType(defaultValues, definition.type);
				}
				[, definition.name] = mathsDefaultArray;
			} else if (mathsDefaultSingle) {
				[, definition.name, definition.defaultValue] = mathsDefaultSingle;

				if (definition.type === Boolean) {
					if (['true', 'false'].includes(definition.defaultValue)) {
						definition.defaultValue = setValueOfType(definition.defaultValue, Boolean);
					} else {
						definition.type = String;
						definition.defaultValue = setValueOfType(definition.defaultValue, String);
					}
				} else {
					definition.defaultValue = setValueOfType(definition.defaultValue, definition.type);
				}
			} else {
				definition.name = newToken;
				definition.defaultValue = definition.type === Boolean ? false : null;
				definition.type = definition.type === Boolean ? Boolean : definition.type;
			}
		}
		return definition as Definition;
	} catch (error) {
		return createError(error.message);
	}
}
