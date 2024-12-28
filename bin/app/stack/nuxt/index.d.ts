import { AppBuilder } from '../../app-builder';
import { TemplateBuilder } from '../../template-builder';
export declare class NuxtBuilder implements AppBuilder {
    name: string;
    versions: number[];
    foundation: "vue";
    create(name: string): Promise<void>;
    putAssets<K extends string>(name: string, _version: number, template: TemplateBuilder<K>): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
