import { OptionDefinition } from 'command-line-args';
import { CommandPublicApi } from './public';

export interface CommandPrivateApi extends CommandPublicApi {
	optionDefinition: OptionDefinition[];
	parseOption(argv: string[]): void;
}
