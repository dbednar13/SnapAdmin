import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const DiffVerb = {
  verb: 'diff',
  helpText:
    'Lists all the files have been modified since the last "sync" command.',
};

export const DIFF_OPTIONS: HelpText[] = STANDARD_OPTIONS;

export const DIFF_VERB_HELP: VerbHelp = {
  verb: DiffVerb,
  options: DIFF_OPTIONS,
};
