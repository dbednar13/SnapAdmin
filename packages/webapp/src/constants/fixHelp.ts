import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const FixVerb = '';

/*
{
 short: '',
 long: '',
 helpText: '',
},
*/
export const FIX_OPTIONS: HelpText[] = [...STANDARD_OPTIONS];

export const FIX_VERB_HELP: VerbHelp = {
  verb: FixVerb,
  options: FIX_OPTIONS,
};
