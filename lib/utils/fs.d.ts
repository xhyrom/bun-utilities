export interface RecrusiveOptions {
  recursive?: boolean;
}

export interface CopyDirOptions {
  recursive?: boolean;
  copyFiles?: boolean;
}

export function rmdir(path: string, options?: RecrusiveOptions | undefined | null): string;
export function copyfile(src: string, dest: string, options?: RecrusiveOptions | undefined | null): string;
export function copydir(src: string, dest: string, options?: CopyDirOptions | undefined | null): string;