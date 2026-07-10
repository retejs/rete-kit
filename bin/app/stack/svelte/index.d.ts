import { AppBuilder } from '../../app-builder';
import { TemplateBuilder } from '../../template-builder';
export type SvelteVersion = 3 | 4 | 5;
export declare class SvelteBuilder implements AppBuilder {
    name: string;
    versions: SvelteVersion[];
    foundation: "svelte";
    create(name: string, version: number): Promise<void>;
    putAssets<K extends string>(name: string, _version: number, template: TemplateBuilder<K>): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
