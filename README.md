# bun-utilities

This package adds some missing utilities using `napi` until they are implemented natively.

> **0.2.0 BREAKING CHANGES**  
> Utilities have been split    
> To import `exec`, use `import { exec } from 'bun-utilities/spawn'`  
> To import `rmdir`, use `import { rmdir } from 'bun-utilities/fs'`  
> To import `homedir`, use `import { homedir } from 'bun-utilities/os'`  

## Current utilities

* `bun-utilities/spawn` - `spawn`, `exec`
* `bun-utilities/fs` - `rmdir`, `copydir`, `copyfile`
* `bun-utilities/os` - `homedir`, `cachedir`, `tempdir`, `hostname`, `platform`, `arch`, `release`, `uptime`, `totalMemory`, `usedMemory`, `availableMemory`, `freeMemory`, `totalSwap`, `usedSwap`

> You can use this utilities with bun or node
