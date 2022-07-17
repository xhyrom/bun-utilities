const { readFileSync, existsSync } = require('fs')

const { platform, arch } = process

let nativeBindingPath = null;
let nativeBinding = null
let loadError = null

function isMusl() {
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

switch (platform) {
  case 'android':
    switch (arch) {
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
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
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
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    switch (arch) {
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
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    try {
      nativeBindingPath = './bindings/bun-utilities.freebsd-x64.node'
      nativeBinding = require(nativeBindingPath)
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
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
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { exec, spawn, rmdir, copydir } = nativeBinding

module.exports.exec = exec
module.exports.spawn = spawn
module.exports.rmdir = rmdir
module.exports.copydir = copydir
