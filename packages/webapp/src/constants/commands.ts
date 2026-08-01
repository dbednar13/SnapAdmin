import {
  CHECK_VERB_HELP,
  DIFF_VERB_HELP,
  DUPLICATE_VERB_HELP,
  FIX_VERB_HELP,
  STATUS_VERB_HELP,
  SYNC_VERB_HELP,
  type VerbHelp,
} from '.';

export type Command = {
  title: string;
  command: string;
  description: string;
  helpContext: VerbHelp;
};

export const COMMANDS: Record<string, Command> = {
  diff: {
    title: 'Differences',
    command: '',
    description:
      'Show differences between the current state and the last sync.',
    helpContext: DIFF_VERB_HELP,
  },
  scrub: {
    title: 'Scrub',
    command: '',
    description:
      'Scrubs the array, checking for silent and IO errors.  Defaults to "-p100 -o0"',
    helpContext: SYNC_VERB_HELP,
  },
  status: {
    title: 'Status',
    command: '',
    description:
      'A summary of the state of the disk array upto the last sync time.',
    helpContext: STATUS_VERB_HELP,
  },
  sync: {
    title: 'Sync',
    command: '',
    description:
      'Synchronize with any changes that may have occurred since the last run.',
    helpContext: SYNC_VERB_HELP,
  },
  check: {
    title: 'Check',
    command: '',
    description:
      "Check the snapshot to confirm it's integrity.  Default -a for hash only.",
    helpContext: CHECK_VERB_HELP,
  },
  fix: {
    title: 'Fix',
    command: '',
    description: 'Fix errors set by the scrub command.  Defaults to using "-e"',
    helpContext: FIX_VERB_HELP,
  },
  duplicate: {
    title: 'Duplicate Finder',
    command: '',
    description:
      'Lists all the duplicate files.  Two files are assumed to be equal if their hashes match.',
    helpContext: DUPLICATE_VERB_HELP,
  },
  forceFullSync: {
    title: 'Force Full Sync',
    command: '',
    description: 'Sync with the "-F" to recompute the full parity',
    helpContext: SYNC_VERB_HELP,
  },
  discoverMissing: {
    title: 'Discover Missing',
    command: '',
    description:
      'Check the snapshot for missing files. Default --filter-missing',
    helpContext: CHECK_VERB_HELP,
  },
};
