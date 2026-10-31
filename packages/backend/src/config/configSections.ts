export const HEADER = ['# Example configuration for SnapRaid for Windows'].join(
  '\n'
);

export const PARITY_SECTION = [
  '# Defines the file to use as parity storage',
  '# It must NOT be in a data disk',
  '# Format: "parity FILE [,FILE] ..."',
].join('\n');

export const ADDITIONAL_PARITY_SECTION = [
  '',
  '# Defines the files to use as additional parity storage.',
  '# If specified, they enable the multiple failures protection',
  '# from two to six level of parity.',
  '# To enable, uncomment one parity file for each level of extra',
  '# protection required. Start from 2-parity, and follow in order.',
  '# It must NOT be in a data disk',
  '# Format: "X-parity FILE [,FILE] ..."',
].join('\n');

export const CONTENT_FILE_SECTION = [
  '',
  '# Defines the files to use as content list',
  '# You can use multiple specification to store more copies',
  "# You must have least one copy for each parity file plus one. Some more don't hurt",
  '# They can be in the disks used for data, parity or boot,',
  '# but each file must be in a different disk',
  '# Format: "content FILE"',
].join('\n');

export const DATA_DRIVE_SECTION = [
  '',
  '# Defines the data disks to use',
  '# The name and mount point association is relevant for parity, do not change it',
  '# WARNING: Adding here your boot C:\\ disk is NOT a good idea!',
  '# SnapRAID is better suited for files that rarely changes!',
  '# Format: "data DISK_NAME DISK_MOUNT_POINT"',
].join('\n');

export const EXTRA_SECTION = [
  '',
  '# Defines the name and mount point of additional disks to monitor',
  "# with the 'smart' and 'probe' commands.",
  '# This is useful for monitoring disks that are not part of the array',
  '# but are required for the system to function, such as the boot disk.',
  '# Format: "other DISK_NAME DISK_MOUNT_POINT"',
].join('\n');

export const HIDDEN_FILE_SECTION = [
  '',
  '# Excludes hidden files and directories (uncomment to enable).',
].join('\n');

export const EXCLUDE_SECTION = [
  '',
  '# Defines files and directories to exclude',
  '# Remember that all the paths are relative at the mount points',
  '# Format: "exclude FILE"',
  '# Format: "exclude DIR\\"',
  '# Format: "exclude \\PATH\\FILE"',
  '# Format: "exclude \\PATH\\DIR\\"',
].join('\n');

export const BLOCK_SIZE_SECTION = [
  '',
  '# Defines the block size in kibi bytes (1024 bytes) (uncomment to enable).',
  '# WARNING: Changing this value is for experts only!',
  '# Default value is 256 -> 256 kibi bytes -> 262144 bytes',
  '# Format: "blocksize SIZE_IN_KiB"',
].join('\n');

export const HASH_SIZE_SECTION = [
  '',
  '# Defines the hash size in bytes (uncomment to enable).',
  '# WARNING: Changing this value is for experts only!',
  '# Default value is 16 -> 128 bits',
  '# Format: "hashsize SIZE_IN_BYTES"',
  '#hashsize 16',
].join('\n');

export const AUTOSAVE_SECTION = [
  '',
  '# Automatically save the state when syncing after the specified amount',
  '# of GB processed (uncomment to enable).',
  "# This option is useful to avoid to restart from scratch long 'sync'",
  '# commands interrupted by a machine crash.',
  "# It also improves the recovering if a disk break during a 'sync'.",
  '# Default value is 0, meaning disabled.',
  '# Format: "autosave SIZE_IN_GB"',
].join('\n');

export const TEMP_LIMIT_SECTION = [
  '',
  '# Set the maximum allowed disk temperature (in Celsius).',
  '# If any disk reaches or exceeds this temperature,',
  '# SnapRAID stops all operations and spins down all disks',
  '# to prevent overheating.',
].join('\n');

export const TEMP_SLEEP_SECTION = [
  '',
  '# Set the standby duration (in minutes) after a temperature event.',
  '# During this period, disks remain spun down to cool down',
  '# before SnapRAID automatically resumes operations.',
  '# Default is 15 minutes if not specified.',
].join('\n');

export const POOLING_SECTION = [
  '',
  '# Defines the pooling directory where the virtual view of the disk',
  '# array is created using the "pool" command (uncomment to enable).',
  '# The files are not really copied here, but just linked using',
  '# symbolic links.',
  '# This directory must be outside the array.',
  '# Format: "pool DIR"',
  '#pool C:\\pool',
].join('\n');

export const SHARE_SECTION = [
  '',
  '# Defines the Windows UNC path required to access disks from the pooling',
  '# directory when shared in the network.',
  '# If present (uncomment to enable), the symbolic links created in the',
  '# pool virtual view, instead of using local paths, are created using the',
  '# specified UNC path, adding the disk names and file path.',
  '# This allows to share the pool directory in the network.',
  '# See the manual page for more details.',
  '#',
  '# Format: "share UNC_DIR"',
  '#share \\\\server',
].join('\n');

export const SMARTCTL_SECTION = [
  '',
  '# Defines a custom smartctl command to obtain the SMART attributes',
  '# for each disk. This may be required for RAID controllers and for',
  '# some USB disk that cannot be autodetected.',
  '# In the specified options, the "%s" string is replaced by the device name.',
  '# Refers at the smartmontools documentation about the possible options:',
  '# RAID -> https://www.smartmontools.org/wiki/Supported_RAID-Controllers',
  '# USB -> https://www.smartmontools.org/wiki/Supported_USB-Devices',
  '#smartctl d1 -d sat %s',
  '#smartctl d2 -d usbjmicron %s',
  '#smartctl parity -d areca,1/1 /dev/arcmsr0',
  '#smartctl 2-parity -d areca,2/1 /dev/arcmsr0',
].join('\n');
