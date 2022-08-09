export interface ProcessResult {
  stdout?: string;
  stderr?: string;
  exitCode?: number;
  isExecuted: boolean;
}
export interface Options {
  cwd?: string;
  stdin?: 'inherit' | 'piped' | null;
  stdout?: 'inherit' | 'piped' | null;
  stderr?: 'inherit' | 'piped' | null;
}
export function exec(commandWithArgs: Array<string>, options?: Options | undefined | null): { stdout: undefined, stderr: undefined, exitCode?: number, isExecuted: false } | { stdout: string, stderr: string, exitCode?: number, isExecuted: true };
export function spawn(command: string, args: Array<string>, options?: Options | undefined | null): { stdout: undefined, stderr: undefined, exitCode?: number, isExecuted: false } | { stdout: string, stderr: string, exitCode?: number, isExecuted: true };
export function execAndDontWait(commandWithArgs: Array<string>, options?: Options | undefined | null): ProcessResult;
export function spawnAndDontWait(command: string, args: Array<string>, options?: Options | undefined | null): { isExecuted: true };
