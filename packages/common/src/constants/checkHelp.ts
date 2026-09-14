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
export const CHECK_OPTIONS: HelpText[] = [
  ...STANDARD_OPTIONS,
  {
    short: 'f',
    long: 'filter',
    helpText:
      'Filters the files to process in "check" and "fix". Only the files matching the entered pattern are processed. ' +
      'This option can be used many times.See the PATTERN section for more details in the pattern specifications. ' +
      'In Unix, ensure to quote globbing chars if used.This option can be used only with "check" and "fix". ' +
      'Note that it cannot be used with "sync" and "scrub", because they always process the whole array.',
  },
  {
    short: 'd',
    long: 'filter-disk',
    helpText:
      'Filters the disks to process in "check", "fix", "up" and "down". You must specify a disk name as named ' +
      'in the configuration file.You can also specify parity disks with the names: "parity", "2-parity", ' +
      '"3 -parity", ... to limit the operations a specific parity disk.If you combine more --filter, ' +
      '--filter-disk and --filter-missing options, only files matching all the set of filters are selected. ' +
      'This option can be used many times. This option can be used only with "check", "fix", "up" and "down". ' +
      'Note that it cannot be used with "sync" and "scrub", because they always process the whole array.',
  },
  {
    short: 'm',
    long: 'filter-missing',
    helpText:
      'Filters the files to process in "check" and "fix". Only the files missing/deleted from the array are processed. ' +
      'When used with "fix", this is a kind of "undelete" command.If you combine more --filter, --filter-disk ' +
      'and --filter-missing options, only files matching all the set of filters are selected. ' +
      'This option can be used only with "check" and "fix". Note that it cannot be used with "sync" and "scrub", ' +
      'because they always process the whole array.',
  },
  {
    short: 'e',
    long: 'filter-error',
    helpText:
      'Filters the blocks to process in "check" and "fix". It processes only the blocks marked with silent or ' +
      'input/output errors during "sync" and "scrub", and listed in "status". This option can be used only with "check" and "fix".',
  },
  {
    short: 'a',
    long: 'audit-only',
    helpText:
      'In "check" verifies the hash of the files without doing any kind of check on the parity data. ' +
      'If you are interested in checking only the file data this option can speedup a lot the checking process. ' +
      'This option can be used only with "check".',
  },
  {
    short: 'i',
    long: 'import',
    helpText:
      'Imports from the specified directory any file that you deleted from the array after the last "sync". ' +
      'If you still have such files, they could be used by "check" and "fix" to improve the recover process. ' +
      'The files are read also in subdirectories and they are identified regardless of their name.This option ' +
      'can be used only with "check" and "fix".',
  },
  {
    short: 'u',
    long: 'force-uuid',
    helpText:
      'Forces the insecure operation of syncing, checking and fixing with disks that have changed their UUID. ' +
      'If SnapRAID detects that some disks have changed UUID, it stops proceeding unless you specify this option. ' +
      "This allows to detect when your disks are mounted in the wrong mount points. It's anyway allowed to have " +
      "a single UUID change with single parity, and more with multiple parity, because it's the normal case of " +
      'replacing disks after a recovery. This option can be used only with "sync", "check" or "fix".',
  },
  {
    short: 'N',
    long: 'force-nocopy',
    helpText:
      'In "sync", "check" and "fix", disables the copy detection heuristic.Without this option SnapRAID assumes ' +
      'that files with same attributes, like name, size and time-stamp are copies with the same data. ' +
      'This allows to identify copied or moved files from one disk to another, and to reuse the already computed ' +
      'hash information to detect silent errors or to recover missing files. This behavior, in some rare cases, ' +
      'may result in false positives, or in a slow process due the many hash verifications, and this option allows ' +
      'to resolve them. This option can be used only with "sync", "check" and "fix".',
  },
];

export const CHECK_VERB_HELP: VerbHelp = {
  verb: CheckVerb,
  options: CHECK_OPTIONS,
};
