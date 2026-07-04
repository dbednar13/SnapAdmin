import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const DuplicateVerb = '';

/*
{
 short: '',
 long: '',
 helpText: '',
},
*/
export const DUPLICATE_OPTIONS: HelpText[] = [...STANDARD_OPTIONS];

export const DUPLICATE_VERB_HELP: VerbHelp = {
  verb: DuplicateVerb,
  options: DUPLICATE_OPTIONS,
};
