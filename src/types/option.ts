import { OptionDefinition } from 'command-line-args';

export interface Definition extends OptionDefinition {
	description: string;
	type: NumberConstructor | BooleanConstructor | StringConstructor;
}
