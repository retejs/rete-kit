import { AppBuilder } from '../../app-builder';
export declare class ViteBuilder implements AppBuilder {
    name: string;
    versions: number[];
    foundation: "react";
    create(name: string): Promise<void>;
    putAssets(name: string): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
