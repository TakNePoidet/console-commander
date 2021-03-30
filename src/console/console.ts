/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
	print, info, warn, error, table
} from './output';


/**
 *
 */
class ConsoleBase {
	static methods = {
		print, info, warn, error, table
	};
}

const handler = {
	get<T extends ConsoleBase>(target: T, name) {
		if (Object.prototype.hasOwnProperty.call(target, name)) {
			return Reflect.get(target, name);
		}
		if (Object.prototype.hasOwnProperty.call(Reflect.get(target, 'methods'), name)) {
			return Reflect.get(target, 'methods').name.bind(target);
		}
		return undefined;
	}
};

export interface ConsoleOutputInterface {
	info(value: string): void;
	warn(value: string): void;
	error(value: string): void;
	table(value: Array<Array<any>>): void;
	print(value: any);
}

type Constrictor<T> = { new(): T; };

/**
 * @param className
 */
export function handlerProxy(className: Constrictor<ConsoleBase>): Constrictor<ConsoleOutputInterface> {
	return new Proxy(className, {
		construct(Target: Constrictor<ConsoleBase>) {
			return new Proxy(new Target(), handler);
		}
	})();
}


export const Console = handlerProxy(ConsoleBase);
