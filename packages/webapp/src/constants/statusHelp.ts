import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const StatusVerb = '';

/*
{
 short: '',
 long: '',
 helpText: '',
},
*/
export const STATUS_OPTIONS: HelpText[] = [...STANDARD_OPTIONS];

export const STATUS_VERB_HELP: VerbHelp = {
  verb: StatusVerb,
  options: STATUS_OPTIONS,
};
