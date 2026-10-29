import type { SnapRaidConfig, SnapRaidConfigWithValidation } from 'common';
import { type SubmitEvent, useEffect, useState } from 'react';
import { Link, useBeforeUnload, useBlocker, useNavigate } from 'react-router';

type ParityField =
  | 'parityFile1'
  | 'parityFile2'
  | 'parityFile3'
  | 'parityFile4'
  | 'parityFile5'
  | 'parityFile6';

const parityFields: { name: ParityField; label: string }[] = [
  { name: 'parityFile1', label: 'Parity file' },
  { name: 'parityFile2', label: '2-parity file' },
  { name: 'parityFile3', label: '3-parity file' },
  { name: 'parityFile4', label: '4-parity file' },
  { name: 'parityFile5', label: '5-parity file' },
  { name: 'parityFile6', label: '6-parity file' },
];

const toEditableConfig = (
  result: SnapRaidConfigWithValidation
): SnapRaidConfig => ({
  parityFile1: result.parityFile1 ?? '',
  parityFile2: result.parityFile2 ?? '',
  parityFile3: result.parityFile3 ?? '',
  parityFile4: result.parityFile4 ?? '',
  parityFile5: result.parityFile5 ?? '',
  parityFile6: result.parityFile6 ?? '',
  contentFiles: result.contentFiles ?? [],
  snapShotSources: result.snapShotSources ?? [],
  excludePatterns: result.excludePatterns ?? [],
  includePatterns: result.includePatterns ?? [],
  blockSizeKB: result.blockSizeKB,
  autoSaveGB: result.autoSaveGB,
  nohidden: result.nohidden,
});

const parseLines = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function SnapRaidConfigPage() {
  const navigate = useNavigate();
  const [config, setConfig] = useState<SnapRaidConfig | null>(null);
  const [initialConfig, setInitialConfig] = useState<SnapRaidConfig | null>(
    null
  );
  const [configErrors, setConfigErrors] = useState<string[]>([]);
  const [configWarnings, setConfigWarnings] = useState<string[]>([]);
  const [saveErrors, setSaveErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [missingConfigPath, setMissingConfigPath] = useState(false);
  const [navigateAfterSave, setNavigateAfterSave] = useState(false);
  const isDirty =
    config !== null &&
    initialConfig !== null &&
    JSON.stringify(config) !== JSON.stringify(initialConfig);
  const blocker = useBlocker(isDirty);

  useBeforeUnload((event) => {
    if (isDirty) {
      event.preventDefault();
    }
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      if (window.confirm('You have unsaved changes. Leave without saving?')) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  useEffect(() => {
    if (navigateAfterSave) {
      navigate('/', { replace: true });
    }
  }, [navigate, navigateAfterSave]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/snapConfig');
        const result =
          (await response.json()) as SnapRaidConfigWithValidation & {
            message?: string;
          };

        if (!response.ok) {
          throw new Error(result.message || 'Unable to load SnapRAID config.');
        }

        const hasConfigPathError = result.configErrors.some((error) =>
          error.toLowerCase().includes('snapraid config path is not set')
        );
        const editableConfig = toEditableConfig(result);

        setMissingConfigPath(hasConfigPathError);
        setConfigErrors(result.configErrors ?? []);
        setConfigWarnings(result.configWarnings ?? []);
        setConfig(editableConfig);
        if (!hasConfigPathError) {
          setInitialConfig(editableConfig);
        }
      } catch (error) {
        setSaveErrors([
          error instanceof Error
            ? error.message
            : 'Unable to load SnapRAID config.',
        ]);
      } finally {
        setLoading(false);
      }
    };

    void loadConfig();
  }, []);

  const updateConfig = <K extends keyof SnapRaidConfig>(
    key: K,
    value: SnapRaidConfig[K]
  ) => {
    setConfig((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config) {
      return;
    }

    setSaving(true);
    setSaveErrors([]);
    try {
      const response = await fetch('/api/snapConfig', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const result = (await response.json()) as {
        message?: string;
        errors?: string[];
      };

      if (!response.ok) {
        throw new Error(
          result.errors?.join(' ') ||
            result.message ||
            'Unable to save SnapRAID config.'
        );
      }

      setInitialConfig(config);
      setNavigateAfterSave(true);
    } catch (error) {
      setSaveErrors([
        error instanceof Error
          ? error.message
          : 'Unable to save SnapRAID config.',
      ]);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl">
      <header className="mb-6 border-b border-gray-200 pb-4 dark:border-neutral-700">
        <h1 className="text-2xl font-semibold">SnapRAID Configuration</h1>
      </header>

      {loading ? (
        <p
          role="status"
          className="text-sm text-gray-600 dark:text-neutral-400"
        >
          Loading configuration...
        </p>
      ) : (
        <>
          {missingConfigPath && (
            <div
              role="alert"
              className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-950 dark:bg-red-950/40 dark:text-red-100"
            >
              <p className="font-semibold">SnapRAID config path is not set.</p>
              <p className="mt-1">
                Define the config file in{' '}
                <Link
                  to="/admin-config"
                  className="font-semibold underline underline-offset-2"
                >
                  Admin Config
                </Link>
                .
              </p>
            </div>
          )}

          {configErrors.length > 0 && (
            <div
              role="alert"
              className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-950 dark:bg-red-950/40 dark:text-red-100"
            >
              <p className="font-semibold">Configuration validation issues</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {configErrors.map((error, index) => (
                  <li key={`${index}-${error}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {configWarnings.length > 0 && (
            <div
              role="status"
              className="mb-4 border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100"
            >
              <p className="font-semibold">Configuration warnings</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {configWarnings.map((warning, index) => (
                  <li key={`${index}-${warning}`}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {saveErrors.length > 0 && (
            <div
              role="alert"
              className="mb-4 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-950 dark:bg-red-950/40 dark:text-red-100"
            >
              <p className="font-semibold">Configuration request failed</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {saveErrors.map((error, index) => (
                  <li key={`${index}-${error}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {!missingConfigPath && config && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="space-y-4 border-b border-gray-200 pb-6 dark:border-neutral-700">
                <legend className="mb-3 text-base font-semibold">
                  Parity files
                </legend>
                <div className="grid gap-4 md:grid-cols-2">
                  {parityFields.map(({ name, label }, index) => (
                    <div key={name}>
                      <label
                        htmlFor={name}
                        className="mb-1 block text-sm font-medium"
                      >
                        {label}
                        {index === 0 ? ' (required)' : ''}
                      </label>
                      <input
                        id={name}
                        value={config[name] ?? ''}
                        required={index === 0}
                        onChange={(event) =>
                          updateConfig(name, event.target.value)
                        }
                        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                      />
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="content-files"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Content files
                  </label>
                  <textarea
                    id="content-files"
                    rows={5}
                    value={config.contentFiles.join('\n')}
                    onChange={(event) =>
                      updateConfig(
                        'contentFiles',
                        parseLines(event.target.value)
                      )
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">Data sources</h2>
                    <button
                      type="button"
                      onClick={() =>
                        updateConfig('snapShotSources', [
                          ...config.snapShotSources,
                          {
                            name: `d${config.snapShotSources.length + 1}`,
                            dirSource: '',
                          },
                        ])
                      }
                      className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
                    >
                      Add source
                    </button>
                  </div>
                  <div className="mb-1 grid grid-cols-[minmax(4rem,0.3fr)_minmax(0,1fr)_auto] gap-2 text-xs font-medium text-gray-600 dark:text-neutral-400">
                    <span>Disk</span>
                    <span>Directory</span>
                    <span className="sr-only">Actions</span>
                  </div>
                  <div className="space-y-2">
                    {config.snapShotSources.map((source, index) => (
                      <div
                        key={`${source.name}-${index}`}
                        className="grid grid-cols-[minmax(4rem,0.3fr)_minmax(0,1fr)_auto] gap-2"
                      >
                        <input
                          aria-label={`Data source ${index + 1} name`}
                          value={source.name}
                          onChange={(event) => {
                            const sources = [...config.snapShotSources];
                            sources[index] = {
                              ...source,
                              name: event.target.value,
                            };
                            updateConfig('snapShotSources', sources);
                          }}
                          className="min-w-0 rounded border border-gray-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                        />
                        <input
                          aria-label={`Data source ${index + 1} path`}
                          value={source.dirSource}
                          onChange={(event) => {
                            const sources = [...config.snapShotSources];
                            sources[index] = {
                              ...source,
                              dirSource: event.target.value,
                            };
                            updateConfig('snapShotSources', sources);
                          }}
                          className="min-w-0 rounded border border-gray-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                        />
                        <button
                          type="button"
                          aria-label={`Remove data source ${index + 1}`}
                          title="Remove source"
                          onClick={() =>
                            updateConfig(
                              'snapShotSources',
                              config.snapShotSources.filter(
                                (_, itemIndex) => itemIndex !== index
                              )
                            )
                          }
                          className="rounded border border-gray-300 px-3 text-sm hover:bg-gray-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="exclude-patterns"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Exclude patterns
                  </label>
                  <textarea
                    id="exclude-patterns"
                    rows={5}
                    value={config.excludePatterns.join('\n')}
                    onChange={(event) =>
                      updateConfig(
                        'excludePatterns',
                        parseLines(event.target.value)
                      )
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="include-patterns"
                    className="mb-1 block text-sm font-semibold"
                  >
                    Include patterns
                  </label>
                  <textarea
                    id="include-patterns"
                    rows={5}
                    value={config.includePatterns.join('\n')}
                    onChange={(event) =>
                      updateConfig(
                        'includePatterns',
                        parseLines(event.target.value)
                      )
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                </div>
              </div>

              <fieldset className="grid gap-4 border-t border-gray-200 pt-5 md:grid-cols-3 dark:border-neutral-700">
                <legend className="text-sm font-semibold">
                  General settings
                </legend>
                <div>
                  <label
                    htmlFor="block-size"
                    className="mb-1 block text-sm font-medium"
                  >
                    Block size (KB)
                  </label>
                  <input
                    id="block-size"
                    type="number"
                    min={32}
                    max={16384}
                    value={config.blockSizeKB}
                    onChange={(event) =>
                      updateConfig('blockSizeKB', Number(event.target.value))
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label
                    htmlFor="auto-save"
                    className="mb-1 block text-sm font-medium"
                  >
                    Autosave (GB)
                  </label>
                  <input
                    id="auto-save"
                    type="number"
                    min={10}
                    max={32767}
                    value={config.autoSaveGB}
                    onChange={(event) =>
                      updateConfig('autoSaveGB', Number(event.target.value))
                    }
                    className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800"
                  />
                </div>
                <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={config.nohidden}
                    onChange={(event) =>
                      updateConfig('nohidden', event.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  Exclude hidden files
                </label>
              </fieldset>

              <div className="flex justify-end border-t border-gray-200 pt-5 dark:border-neutral-700">
                <button
                  type="submit"
                  disabled={saving || !isDirty}
                  className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save configuration'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </section>
  );
}
