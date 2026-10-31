import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText.js';

export const DuplicateVerb = {
  verb: 'duplicate',
  helpText:
    'Lists all the duplicate files. Two files are assumed equal if their hashes are matching.',
};

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
