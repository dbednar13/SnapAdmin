export type Command = {
  title: string;
  command: string;
  description: string;
  helpContext: string[];
};

export const commands: Command[] = [
  {
    title: 'Differences',
    command: '',
    description:
      'Show differences between the current state and the last sync.',
    helpContext: [],
  },
  {
    title: 'Scrub',
    command: '',
    description:
      'Scrubs the array, checking for silent and IO errors.  Defaults to "-p100 -o0"',
    helpContext: [],
  },
  {
    title: 'Status',
    command: '',
    description:
      'A summary of the state of the disk array upto the last sync time.',
    helpContext: [],
  },
  {
    title: 'Sync',
    command: '',
    description:
      'Synchronize with any changes that may have occurred since the last run.',
    helpContext: [],
  },
  {
    title: 'Check',
    command: '',
    description:
      "Check the snapshot to confirm it's integrity.  Default -a for hash only.",
    helpContext: [],
  },
  {
    title: 'Fix',
    command: '',
    description: 'Fix errors set by the scrub command.  Defaults to using "-e"',
    helpContext: [],
  },
  {
    title: 'Duplicate Finder',
    command: '',
    description:
      'Lists all the duplicate files.  Two files are assumed to be equal if their hashes match.',
    helpContext: [],
  },
  {
    title: 'Force Full Sync',
    command: '',
    description: 'Sync with the "-F" to recompute the full parity',
    helpContext: [],
  },
  {
    title: 'Discover Missing',
    command: '',
    description:
      'Check the snapshot for missing files. Default --filter-missing',
    helpContext: [],
  },
];
