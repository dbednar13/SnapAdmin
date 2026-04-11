# Elucidate TypeScript Backend

Initial migration package for core non-UI Elucidate logic.

## Included in this phase

- Config parser/serializer port from ConfigFileHelper
- Core models/constants
- Simplified storage provider abstraction (placeholder drive-size values)
- Non-UI utility behavior mapping from Util.cs (directory creation, SHA1 hashing, rounding, command arg formatting compatibility, process checks, and source path space estimation)

## Build

```bash
npm install
npm run build
```

This is rough, and to be used as a foundation. I don't like lots of the names and feel like we can split things out or otherwise re-arch to better fit a restful API implementation.
