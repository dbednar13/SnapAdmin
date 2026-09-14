import { mergeCommandAndAdditionalArgs } from 'common';
import { useState } from 'react';

import AdditionalArguments from '../additionalArguments';
import CommandButtonGroup from '../commandButtonGroup';
import OutputArea from '../output';

const CommandCenter = () => {
  const [additionalCommandArgs, setAdditionalCommandArgs] = useState('');

  const handleCommandExecution = (command: string) => {
    const fullCommand = mergeCommandAndAdditionalArgs(
      command,
      additionalCommandArgs
    );

    console.log('fullCommand', fullCommand);
  };

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold">Command Center</h1>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
          Home base for running SnapRAID.
        </p>
      </section>

      <CommandButtonGroup onCommandExecution={handleCommandExecution} />

      <AdditionalArguments onValueChange={setAdditionalCommandArgs} />

      {/*
       * TODO:
       *    Send command to backend
       */}

      <OutputArea />
    </>
  );
};

export default CommandCenter;
