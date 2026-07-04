import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const DiffVerb =
  'Defaults to 8% of all of blocks (oldest unchecked first).\r\nBlocks already marked as bad are always checked.\r\nUse "Additional Command" to override the default of 100% of 0 days';

export const DIFF_OPTIONS: HelpText[] = STANDARD_OPTIONS;

export const DIFF_VERB_HELP: VerbHelp = {
  verb: DiffVerb,
  options: DIFF_OPTIONS,
};
