import { COMMANDS, type Command } from 'common';

import type { SvgIconComponent } from '@mui/icons-material';
import {
  AssessmentTwoTone,
  AutoFixHighTwoTone,
  BuildTwoTone,
  CleaningServicesTwoTone,
  CompareArrowsTwoTone,
  ContentCopyTwoTone,
  FactCheckTwoTone,
  SearchOffTwoTone,
  SyncAltTwoTone,
} from '@mui/icons-material';

export type ActionButton = Command & {
  icon: SvgIconComponent;
};

export const buttons: ActionButton[] = [
  {
    ...COMMANDS.diff,
    icon: CompareArrowsTwoTone,
  },
  {
    ...COMMANDS.scrub,
    icon: CleaningServicesTwoTone,
  },
  {
    ...COMMANDS.status,
    icon: AssessmentTwoTone,
  },
  {
    ...COMMANDS.sync,
    icon: SyncAltTwoTone,
  },
  {
    ...COMMANDS.check,
    icon: FactCheckTwoTone,
  },
  {
    ...COMMANDS.fix,
    icon: BuildTwoTone,
  },
  {
    ...COMMANDS.duplicate,
    icon: ContentCopyTwoTone,
  },
  {
    ...COMMANDS.forceFullSync,
    icon: AutoFixHighTwoTone,
  },
  {
    ...COMMANDS.discoverMissing,
    icon: SearchOffTwoTone,
  },
];
