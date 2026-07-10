import { AppBuilder } from '../../app-builder';
export declare class ReactBuilder implements AppBuilder {
    name: string;
    versions: number[];
    foundation: "react";
    create(name: string, version: number): Promise<void>;
    putAssets(name: string, version: number): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
