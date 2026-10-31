import {
  CHECK_OPTIONS,
  DIFF_OPTIONS,
  DUPLICATE_OPTIONS,
  FIX_OPTIONS,
  SCRUB_OPTIONS,
  STANDARD_OPTIONS,
  STATUS_OPTIONS,
  SYNC_OPTIONS,
} from '../constants/index.js';

const ARGUMENTS_WITH_VALUES = new Set([
  'log',
  'error-limit',
  'start',
  'count',
  'plan',
  'older-than',
  'filter',
  'filter-disk',
  'filter-missing',
  'filter-error',
  'import',
]);

const DEFINITION_BASED_ARGUMENTS = [
  ...STANDARD_OPTIONS,
  ...CHECK_OPTIONS,
  ...DIFF_OPTIONS,
  ...DUPLICATE_OPTIONS,
  ...FIX_OPTIONS,
  ...SCRUB_OPTIONS,
  ...STATUS_OPTIONS,
  ...SYNC_OPTIONS,
];

const ALLOWED_COMMAND_OPTIONS = new Set(
  DEFINITION_BASED_ARGUMENTS.flatMap(({ short, long }) => [
    ...(short ? [`-${short}`] : []),
    ...(long ? [`--${long}`] : []),
  ])
);

export const test = 'abc';
export const test2 = 'def';

export const sanitizeCommandInput = (value: string) => {
  value = value
    .replace(/`[^`]*`/g, ' ')
    .replace(/\$\([^)]*\)/g, ' ')
    .replace(/&&|\|\||[;&|<>]/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .join(' ');

  return value;
};

const getOptionKey = (token: string) => {
  const longOptionMatch = token.match(/^--([A-Za-z0-9-]+)(?:=(.*))?$/);
  if (longOptionMatch) {
    return `--${longOptionMatch[1]}`;
  }

  const shortOptionMatch = token.match(/^-([A-Za-z])(?:=(.*))?$/);
  if (shortOptionMatch) {
    return `-${shortOptionMatch[1]}`;
  }

  return null;
};

const getOptionValueFlag = (optionToken: string) => {
  const longOptionMatch = optionToken.match(/^--([A-Za-z0-9-]+)$/);
  if (longOptionMatch) {
    return ARGUMENTS_WITH_VALUES.has(longOptionMatch[1])
      ? longOptionMatch[1]
      : null;
  }

  const shortOptionMatch = optionToken.match(/^-([A-Za-z])$/);
  if (shortOptionMatch) {
    const shortName = shortOptionMatch[1];
    const hasValue = DEFINITION_BASED_ARGUMENTS.some(
      ({ short, long }) =>
        short === shortName && long && ARGUMENTS_WITH_VALUES.has(long)
    );

    return hasValue ? shortName : null;
  }

  return null;
};

const isAllowedOptionToken = (token: string) => {
  const optionKey = getOptionKey(token);
  return optionKey ? ALLOWED_COMMAND_OPTIONS.has(optionKey) : false;
};

const extractOptionEntries = (
  tokens: string[]
): Array<{ key: string; tokens: string[] }> => {
  const entries: Array<{ key: string; tokens: string[] }> = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const optionKey = getOptionKey(token);

    if (!optionKey || !isAllowedOptionToken(token)) {
      continue;
    }

    const entryTokens = [token];
    const optionNeedsValue = !!getOptionValueFlag(token);

    if (optionNeedsValue && index + 1 < tokens.length) {
      const nextToken = tokens[index + 1];
      if (!nextToken.startsWith('-')) {
        entryTokens.push(nextToken);
        index += 1;
      }
    }

    entries.push({ key: optionKey, tokens: entryTokens });
  }

  return entries;
};

export const sanitizeAdditionalArguments = (value: string): string => {
  const normalized = sanitizeCommandInput(value);
  const tokens = normalized.split(/\s+/).filter(Boolean);
  const sanitized: string[] = [];
  const duplicateOverrides = new Map<string, string>();
  const seenOptions = new Map<string, string | null>();
  let pendingValueFor: string | null = null;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (pendingValueFor) {
      if (!token.startsWith('-')) {
        duplicateOverrides.set(pendingValueFor, token);
        pendingValueFor = null;
        continue;
      }

      pendingValueFor = null;
    }

    if (!isAllowedOptionToken(token)) {
      continue;
    }

    const optionKey = getOptionKey(token);
    if (!optionKey) {
      continue;
    }

    seenOptions.set(optionKey, null);
    sanitized.push(token);

    const optionValueFlag = getOptionValueFlag(token);
    if (optionValueFlag) {
      pendingValueFor = optionKey;
    }
  }

  const result: string[] = [];
  const renderedKeys = new Set<string>();

  for (let index = 0; index < sanitized.length; index += 1) {
    const token = sanitized[index];
    const optionKey = getOptionKey(token);

    if (!optionKey) {
      continue;
    }

    const previousIndex = result.length - 1;
    if (
      previousIndex >= 0 &&
      result[previousIndex] === token &&
      renderedKeys.has(optionKey)
    ) {
      result.pop();
    }

    if (renderedKeys.has(optionKey)) {
      const previousToken = result[result.length - 1];
      if (previousToken && previousToken !== token) {
        result.pop();
      }
    }

    result.push(token);
    renderedKeys.add(optionKey);

    const optionValueFlag = getOptionValueFlag(token);
    if (optionValueFlag && duplicateOverrides.has(optionKey)) {
      result.push(duplicateOverrides.get(optionKey) as string);
    }
  }

  return result.join(' ');
};

export const mergeCommandAndAdditionalArgs = (
  command: string,
  additionalArgs: string
): string => {
  const sanitizedCommand = sanitizeCommandInput(command);
  const sanitizedAdditionalArgs = sanitizeAdditionalArguments(additionalArgs);

  if (!sanitizedCommand) {
    return sanitizedAdditionalArgs;
  }

  if (!sanitizedAdditionalArgs) {
    return sanitizedCommand;
  }

  const commandTokens = sanitizedCommand.split(/\s+/).filter(Boolean);
  const additionalTokens = sanitizedAdditionalArgs.split(/\s+/).filter(Boolean);

  const commandName = commandTokens[0];
  const commandOptions = extractOptionEntries(commandTokens.slice(1));
  const additionalOptions = extractOptionEntries(additionalTokens);

  const overrideKeys = new Set(additionalOptions.map(({ key }) => key));

  const mergedOptions = [
    ...commandOptions.filter(({ key }) => !overrideKeys.has(key)),
    ...additionalOptions,
  ];

  const finalTokens = [
    commandName,
    ...mergedOptions.flatMap(({ tokens }) => tokens),
  ];
  return finalTokens.join(' ');
};
