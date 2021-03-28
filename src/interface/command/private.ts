import { CommandLineOptions, OptionDefinition } from 'command-line-args';
import { CommandPublicApi } from './public';

export interface CommandDescription {
	name: string;
	summary: string;
}

export type OptionDescription = string;
export type OptionDescriptions = Record<string, OptionDescription>;

export interface CommandPrivateApi extends CommandPublicApi {
	commandName: string;
	optionDefinition: OptionDefinition[];
	optionDescriptions: OptionDescriptions;
	parseOption(globalOption: CommandLineOptions, argv: string[]): void;
	options: CommandLineOptions;
	help(): void;
}
