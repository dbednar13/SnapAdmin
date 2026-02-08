/*
 * functions to manage SnapRaid actions like sync, scrub, etc.
 */

function splitArguments(arg: string): [string, string[]] {
  const newArg = arg.split(' ');
  const key = newArg[0];

  return [key, newArg];
}

function processArg(arg: string[]): string {
  // process a single command line argument for SnapRaid commands.
  let value = '';

  if (arg.length > 1) {
    for (let i = 1; i < arg.length; i++) {
      value += arg[i] + ' ';
    }
  }
  return value.trim();
}

function toString(args: Record<string, string>): string {
  const parts: string[] = [];
  Object.keys(args).forEach((key) => {
    const rawValue = args[key];
    const value =
      typeof rawValue === 'string'
        ? rawValue.trim()
        : String(rawValue ?? '').trim();

    if (key.startsWith('-')) {
      // Key is already a flag (e.g. "-c"), don't prefix another dash.
      if (value) {
        parts.push(key, value);
      } else {
        parts.push(key);
      }
    } else {
      // Key is a subcommand or positional argument (e.g. "check").
      if (value) {
        parts.push(key, value);
      } else {
        parts.push(key);
      }
    }
  });
  return parts.join(' ');
}

function finalizeArguments(defaultArgs: string[], userArgs: string[]): string {
  // finalize command line arguments for SnapRaid commands.
  const config: Record<string, string> = {};

  for (const arg of defaultArgs) {
    const [key, newArg] = splitArguments(arg);

    const value = processArg(newArg);

    config[key] = value;
  }

  for (const arg of userArgs) {
    const [key, newArg] = splitArguments(arg);
    const value = processArg(newArg);

    config[key] = value;
  }

  return toString(config);
}

export function check(userArgs: string[]) {
  const defaultArgs = ['check -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function differences(userArgs: string[]) {
  const defaultArgs = ['differences -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function discoverMissing(userArgs: string[]) {
  const defaultArgs = ['discovermissing -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function duplicateFinder(userArgs: string[]) {
  const defaultArgs = ['duplicatefinder -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function fix(userArgs: string[]) {
  const defaultArgs = ['fix -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function forceFullSync(userArgs: string[]) {
  const defaultArgs = ['sync -c /etc/snapraid.conf -f'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function scrub(userArgs: string[]) {
  const defaultArgs = ['scrub -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function status(userArgs: string[]) {
  const defaultArgs = ['status -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function sync(userArgs: string[]) {
  const defaultArgs = ['sync -c /etc/snapraid.conf'];
  const args = finalizeArguments(defaultArgs, userArgs);

  console.log(args);
}

export function test() {
  // test function for development, doesn't call any actual snapraid.  Delete me.
}
