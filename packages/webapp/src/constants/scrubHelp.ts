import { type HelpText, STANDARD_OPTIONS, type VerbHelp } from './helpText';

export const ScrubVerb =
  'Defaults to 8% of all of blocks (oldest unchecked first).\r\nBlocks already marked as bad are always checked.\r\nUse "Additional Command" to override the default of 100% of 0 days';

export const SCRUB_OPTIONS: HelpText[] = [
  ...STANDARD_OPTIONS,
  {
    short: 'p',
    long: 'plan',
    helpText:
      "Selects the scrub plan. If input is a numeric value from 0 to 100, it's interpreted as the percentage of " +
      'blocks to scrub. Instead of a percentage, you can also specify a plan: "bad" scrubs bad blocks, ' +
      '"new" the blocks not yet scrubbed, and "full" for everything. This option can be used only with "scrub".  ',
  },
  {
    short: 'o',
    long: 'older-than',
    helpText:
      'Selects the older the part of the array to process in "scrub". DAYS is the minimum age in days for a ' +
      'block to be scrubbed, default is 10. Blocks marked as bad are always scrubbed despite this option. ' +
      'This option can be used only with "scrub".  ',
  },
];

export const SCRUB_VERB_HELP: VerbHelp = {
  verb: ScrubVerb,
  options: SCRUB_OPTIONS,
};
