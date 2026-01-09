import type { Context } from './base';
export declare function getAvailableContexts(): Context[];
export declare function getContextNames(): string[];
export declare function getContext(name: string): Context | undefined;
export declare function isValidContext(name: string): boolean;
