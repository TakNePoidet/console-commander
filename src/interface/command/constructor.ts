import { CommandPublicApi } from './public';

export type CommandConstructor = { new (): CommandPublicApi };
