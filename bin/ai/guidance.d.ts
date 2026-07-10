/**
 * Error class that stores guidance and error messages separately.
 * Used for missing parameter errors to provide helpful guidance to users and AI assistants.
 */
export declare class GuidanceError extends Error {
    readonly guidance: Promise<string>;
    constructor(message: string);
}
