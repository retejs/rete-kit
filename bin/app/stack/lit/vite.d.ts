import { AppBuilder } from '../../app-builder';
export declare class LitViteBuilder implements AppBuilder {
    name: string;
    versions: number[];
    foundation: "lit";
    create(name: string, version: number): Promise<void>;
    putAssets(name: string): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
