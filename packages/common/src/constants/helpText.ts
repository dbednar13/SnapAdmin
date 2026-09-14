export type HelpText = {
  short: string;
  long: string;
  helpText: string;
};

export type Verb = {
  verb: string;
  helpText: string;
};

export type VerbHelp = {
  verb: Verb;
  options: HelpText[];
};

/*
{
 short: '',
 long: '',
 helpText: '',
},
*/
export const STANDARD_OPTIONS: HelpText[] = [
  {
    short: 'v',
    long: 'verbose',
    helpText: 'Prints all messages to standard output.',
  },
  {
    short: 'l',
    long: 'log',
    helpText:
      'Write a detailed log in the specified file.If this option is not specified, unexpected errors are printed ' +
      'on the screen, likely resulting in too much output in case of many errors.When -l, --log is specified, on ' +
      "the screen, go only fatal errors that makes SnapRAID to stop progress. If the path starts with '>>' the " +
      "file is opened in append mode. Occurrences of '%D' and '%T' in the name are replaced with the date and time " +
      "in the format YYYYMMDD and HHMMSS.Note that in Windows batch files, you'll have to double the '%' char, " +
      "like result-%%D.log. And to use '>>' you'll have to enclose the name in, like \">> result.log\". " +
      'To output the log to standard output or standard error, you can use respectively " > &1" and ">&2".',
  },
  {
    short: 'L',
    long: 'error-limit',
    helpText:
      'Sets a new error limit before stopping execution. By default SnapRAID stops if it encounters more than 100 ' +
      'Input/Output errors, meaning that likely a disk is going to die. This options affects "sync" and "scrub", ' +
      'that are allowed to continue after the first bunch of disk errors, to try to complete at most their operations. ' +
      'Instead, "check" and "fix" always stop at the first error.',
  },
  {
    short: 'S',
    long: 'start',
    helpText:
      'Starts the processing from the specified block number. It could be useful to retry to check or fix some ' +
      "specific block, in case of a damaged disk. It's present mainly for advanced manual recovering.",
  },
  {
    short: 'B',
    long: 'count',
    helpText:
      "Processes only the specified number of blocks. It's present mainly for advanced manual recovering.",
  },
  {
    short: 'q',
    long: 'quiet',
    helpText:
      'Prints less information on the screen.If specified one time, removes the progress bar, if two times,' +
      'the running operations, three times, the info messages, four times the status messages.' +
      'Fatal errors are always printed on the screen. This option has no effect on the log files.',
  },
];
