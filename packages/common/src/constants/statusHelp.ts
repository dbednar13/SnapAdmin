import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText.js';

export const StatusVerb = {
  verb: 'status',
  helpText:
    'A summary of the state of the disk array, upto the last sync time.',
};

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
