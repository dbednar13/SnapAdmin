import { COMMANDS, type Command } from '@constants';

export type ActionButton = Command & {
  icon: string;
};

export const buttons: ActionButton[] = [
  {
    ...COMMANDS.diff,
    icon: '',
  },
  {
    ...COMMANDS.scrub,
    icon: '',
  },
  {
    ...COMMANDS.status,
    icon: '',
  },
  {
    ...COMMANDS.sync,
    icon: '',
  },
  {
    ...COMMANDS.check,
    icon: '',
  },
  {
    ...COMMANDS.fix,
    icon: '',
  },
  {
    ...COMMANDS.duplicate,
    icon: '',
  },
  {
    ...COMMANDS.forceFullSync,
    icon: '',
  },
  {
    ...COMMANDS.discoverMissing,
    icon: '',
  },
];
