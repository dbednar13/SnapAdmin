import CommandButtonGroup from '../commandButtonGroup';
import OutputArea from '../output';

const CommandCenter = () => {
  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold">Command Center</h1>
        <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
          Home base for running SnapRAID.
        </p>
      </section>

      <CommandButtonGroup />

      {/*
       * TODO:
       *    Add line for additional/override command arguments
       *    Get clicked command from CBG
       *    Format command with additional args
       *    Send command to backend
       */}

      <OutputArea />
    </>
  );
};

export default CommandCenter;
