import { AppBuilder } from '../../app-builder';
export declare class SvelteBuilder implements AppBuilder {
    name: string;
    versions: number[];
    foundation: "svelte";
    create(name: string, version: number): Promise<void>;
    putAssets(name: string): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
