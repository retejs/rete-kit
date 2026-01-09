import { Package } from '../scan';
export declare function choosePackages(list: Package[]): Promise<Package[]>;
export declare function input(message: string): Promise<string>;
export type Option<T> = {
    name: string;
    value: T;
};
export declare function select<T>(message: string, choices: Option<T>[]): Promise<T>;
export declare function select<T>(message: string, choices: Option<T>[], multi: true): Promise<T[]>;
export declare function confirm(message: string, initial?: boolean): Promise<boolean>;
