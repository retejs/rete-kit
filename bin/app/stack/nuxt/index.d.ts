import { AppBuilder } from '../../app-builder';
import { TemplateBuilder } from '../../template-builder';
export declare class NuxtBuilder implements AppBuilder {
    name: string;
    versions: number[];
    foundation: "vue";
    create(name: string, version: number): Promise<void>;
    private getAppRoot;
    putAssets<K extends string>(name: string, version: number, template: TemplateBuilder<K>): Promise<void>;
    putScript(name: string, path: string, code: string, version: number): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
