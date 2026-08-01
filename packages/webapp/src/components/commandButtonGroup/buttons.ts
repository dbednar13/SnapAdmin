import type { VerbHelp } from '../../constants';

export type ActionButton = {
  label: string;
  command: string;
  description: string;
  icon: string;
  helpInfo: VerbHelp;
};
