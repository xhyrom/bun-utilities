const { readFileSync, existsSync, readdirSync, unlinkSync } = require('fs');
const { join } = require('path');

let nativeBindingPath = null;
let nativeBinding = null;
let loadError = null;

const isMusl = () => {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      if (existsSync('./bun-utilities.conf.txt')) {
        if (readFileSync('./bun-utilities.conf.txt').includes('musl')) return true;
        else return false;
      } else return readFileSync('/usr/bin/ldd', 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    if (existsSync('./bun-utilities.conf.txt')) {
      if (readFileSync('./bun-utilities.conf.txt').includes('musl')) return true;
      else return false;
    } else {
      const { glibcVersionRuntime } = process.report.getReport().header
      return !glibcVersionRuntime
    }
  }
}

module.exports = () => {
  if (nativeBinding) return nativeBinding;
  
  switch (process.platform) {
    case 'android':
      switch (process.arch) {
        case 'arm64':
          try {
            nativeBindingPath = './bindings/bun-utilities.android-arm64.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        case 'arm':
          try {
            nativeBindingPath = './bindings/bun-utilities.android-arm-eabi.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        default:
          throw new Error(`Unsupported architecture on Android ${process.arch}`)
      }
      break
    case 'win32':
      switch (process.arch) {
        case 'x64':
          try {
            nativeBindingPath = './bindings/bun-utilities.win32-x64-msvc.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        case 'ia32':
          try {
            nativeBindingPath = './bindings/bun-utilities.win32-ia32-msvc.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        case 'arm64':
          try {
            nativeBindingPath = './bindings/bun-utilities.win32-arm64-msvc.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        default:
          throw new Error(`Unsupported architecture on Windows: ${process.arch}`)
      }
      break
    case 'darwin':
      switch (process.arch) {
        case 'x64':
          try {
            nativeBindingPath = './bindings/bun-utilities.darwin-x64.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        case 'arm64':
          try {
            nativeBindingPath = './bindings/bun-utilities.darwin-arm64.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        default:
          throw new Error(`Unsupported architecture on macOS: ${process.arch}`)
      }
      break
    case 'freebsd':
      if (process.arch !== 'x64') {
        throw new Error(`Unsupported architecture on FreeBSD: ${process.arch}`)
      }
      try {
        nativeBindingPath = './bindings/bun-utilities.freebsd-x64.node'
        nativeBinding = require(nativeBindingPath)
      } catch (e) {
        loadError = e
      }
      break
    case 'linux':
      switch (process.arch) {
        case 'x64':
          if (isMusl()) {
            try {
              nativeBindingPath = './bindings/bun-utilities.linux-x64-musl.node'
              nativeBinding = require(nativeBindingPath)
            } catch (e) {
              loadError = e
            }
          } else {
            try {
              nativeBindingPath = './bindings/bun-utilities.linux-x64-gnu.node'
              nativeBinding = require(nativeBindingPath)
            } catch (e) {
              loadError = e
            }
          }
          break
        case 'arm64':
          if (isMusl()) {
            try {
              nativeBindingPath = './bindings/bun-utilities.linux-arm64-musl.node'
              nativeBinding = require(nativeBindingPath)
            } catch (e) {
              loadError = e
            }
          } else {
            try {
              nativeBindingPath = './bindings/bun-utilities.linux-arm64-gnu.node'
              nativeBinding = require(nativeBindingPath)
            } catch (e) {
              loadError = e
            }
          }
          break
        case 'arm':
          try {
            nativeBindingPath = './bindings/bun-utilities.linux-arm-gnueabihf.node'
            nativeBinding = require(nativeBindingPath)
          } catch (e) {
            loadError = e
          }
          break
        default:
          throw new Error(`Unsupported architecture on Linux: ${process.arch}`)
      }
      break
    default:
      throw new Error(`Unsupported OS: ${process.platform}, architecture: ${process.arch}`)
  }
  
  if (!nativeBinding) {
    if (loadError) {
      throw loadError
    }
    throw new Error(`Failed to load native binding`)
  }
  
  for (const bindings of readdirSync(join(__dirname, 'bindings'))) {
    if (bindings === nativeBindingPath.split('/')[2]) continue;
    if (bindings.endsWith('.node')) unlinkSync(join(__dirname, 'bindings', bindings));
  }
  
  return nativeBinding;
}
