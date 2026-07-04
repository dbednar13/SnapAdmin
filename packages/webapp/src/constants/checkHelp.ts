import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const CheckVerb = {
  verb: 'check',
  helpText:
    "Check the snapshot to confirm it's integrity. (use -a for hash only)",
};

/*
{
 short: '',
 long: '',
 helpText: '',
},
*/
export const CHECK_OPTIONS: HelpText[] = [...STANDARD_OPTIONS];

export const CHECK_VERB_HELP: VerbHelp = {
  verb: CheckVerb,
  options: CHECK_OPTIONS,
};
