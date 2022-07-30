# bun-utilities

This package adds some missing utilities using `napi` until they are implemented natively.

> **0.2.0 BREAKING CHANGES**
> Utilities has been splitted
> To import `exec`, use `import { exec } from 'bun-utilities/spawn'`

## Current utilities

* `bun-utilities/spawn` - `spawn`, `exec`
* `bun-utilities/fs` - `rmdir`, `copydir`, `copyfile`
* `bun-utilities/os` - `homedir`, `cachedir`, `tempdir`, `hostname`, `platform`, `arch`, `release`, `uptime`, `cpus`, `totalMemory`, `usedMemory`, `availableMemory`, `freeMemory`, `totalSwap`, `usedSwap`

> You can use this utilities with bun or node
