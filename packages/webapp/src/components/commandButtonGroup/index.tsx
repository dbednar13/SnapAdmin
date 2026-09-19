import { useEffect, useState } from 'react';

import { Close, HelpOutlined } from '@mui/icons-material';

import { type ActionButton, buttons } from './buttons';

type CommandButtonGroupProps = {
  onCommandExecution?: (command: string) => void;
};

const CommandButtonGroup = ({
  onCommandExecution,
}: CommandButtonGroupProps) => {
  const [activeHelpCommand, setActiveHelpCommand] = useState<string | null>(
    null
  );
  const activeButton = buttons.find(
    (button) => button.command === activeHelpCommand
  );

  useEffect(() => {
    if (!activeButton) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveHelpCommand(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeButton]);

  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {buttons.map((button: ActionButton) => {
          const Icon = button.icon;

          return (
            <div
              key={button.command}
              onClick={() => onCommandExecution?.(button.command)}
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800/70 dark:focus:ring-offset-neutral-900"
            >
              <button
                type="button"
                aria-label={`Show help for ${button.title}`}
                onClick={() => setActiveHelpCommand(button.command)}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-neutral-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
              >
                <HelpOutlined className="h-5 w-5" />
              </button>

              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1 pr-8">
                    <div className="text-lg font-semibold text-slate-800 dark:text-neutral-100">
                      {button.title}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-slate-400 dark:text-neutral-500">
                      {button.command}
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-300 text-center">
                  {button.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeButton ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setActiveHelpCommand(null)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="command-help-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close help"
              title="Close help"
              onClick={() => setActiveHelpCommand(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <Close className="h-5 w-5" />
            </button>

            <div className="pr-10">
              <h2 id="command-help-title" className="text-lg font-semibold">
                {activeButton.helpContext?.verb?.verb || activeButton.command}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                {activeButton.helpContext?.verb?.helpText ||
                  activeButton.description}
              </p>

              {activeButton.helpContext?.options?.length ? (
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600 dark:text-neutral-300">
                  {activeButton.helpContext.options.map((option) => (
                    <li key={`${activeButton.command}-${option.short}`}>
                      <span className="font-medium text-indigo-600 dark:text-indigo-300">
                        -{option.short}, --{option.long}
                      </span>
                      : {option.helpText}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default CommandButtonGroup;
