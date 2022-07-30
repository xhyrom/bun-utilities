declare module 'bun-utilities/os' {
  export function homedir(): string | null;
  export function cachedir(): string | null;
  export function tempdir(): string;
  export function hostname(): string | null;
  export function platform(): string;
  export function arch(): string;
  export function release(): string | null;
  export function uptime(): number | null;
  export interface CpuInfo {
    model: string
    speed: number
    usage: number
    ventorId: string
  }
  export function cpus(): Array<CpuInfo>;
  export function totalMemory(): number;
  export function usedMemory(): number;
  export function availableMemory(): number;
  export function freeMemory(): number;
  export function totalSwap(): number;
  export function usedSwap(): number;
}
