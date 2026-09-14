import { CHECK_VERB_HELP } from './checkHelp';
import { DIFF_VERB_HELP } from './diffHelp';
import { DUPLICATE_VERB_HELP } from './duplicateHelp';
import { FIX_VERB_HELP } from './fixHelp';
import { type VerbHelp } from './helpText';
import { STATUS_VERB_HELP } from './statusHelp';
import { SYNC_VERB_HELP } from './syncHelp';

export type Command = {
  title: string;
  command: string;
  description: string;
  helpContext: VerbHelp;
};

export const COMMANDS: Record<string, Command> = {
  diff: {
    title: 'Differences',
    command: 'diff',
    description:
      'Show differences between the current state and the last sync.',
    helpContext: DIFF_VERB_HELP,
  },
  scrub: {
    title: 'Scrub',
    command: 'scrub -p 100 -o 0',
    description:
      'Scrubs the array, checking for silent and IO errors.  Defaults to "-p 100 -o 0"',
    helpContext: SYNC_VERB_HELP,
  },
  status: {
    title: 'Status',
    command: 'status',
    description:
      'A summary of the state of the disk array upto the last sync time.',
    helpContext: STATUS_VERB_HELP,
  },
  sync: {
    title: 'Sync',
    command: 'sync',
    description:
      'Synchronize with any changes that may have occurred since the last run.',
    helpContext: SYNC_VERB_HELP,
  },
  check: {
    title: 'Check',
    command: 'check -a',
    description:
      "Check the snapshot to confirm it's integrity.  Default -a for hash only.",
    helpContext: CHECK_VERB_HELP,
  },
  fix: {
    title: 'Fix',
    command: 'fix -e',
    description: 'Fix errors set by the scrub command.  Defaults to using "-e"',
    helpContext: FIX_VERB_HELP,
  },
  duplicate: {
    title: 'Duplicate Finder',
    command: 'dup',
    description:
      'Lists all the duplicate files.  Two files are assumed to be equal if their hashes match.',
    helpContext: DUPLICATE_VERB_HELP,
  },
  forceFullSync: {
    title: 'Force Full Sync',
    command: 'sync -F',
    description: 'Sync with the "-F" to recompute the full parity',
    helpContext: SYNC_VERB_HELP,
  },
  discoverMissing: {
    title: 'Discover Missing',
    command: 'check -m',
    description:
      'Check the snapshot for missing files. Default --filter-missing',
    helpContext: CHECK_VERB_HELP,
  },
};
