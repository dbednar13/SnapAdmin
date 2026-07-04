import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const SyncVerb = '';

/*
{
 short: '',
 long: '',
 helpText: '',
},
*/
export const SYNC_OPTIONS: HelpText[] = [...STANDARD_OPTIONS];

export const SYNC_VERB_HELP: VerbHelp = {
  verb: SyncVerb,
  options: SYNC_OPTIONS,
};
