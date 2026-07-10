import { default as execa, Options } from 'execa';
export declare const exec: (file: string, args?: readonly string[], options?: Options) => Promise<execa.ExecaReturnValue<string>>;
