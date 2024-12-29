import { AppBuilder } from '../../app-builder';
import { TemplateBuilder } from '../../template-builder';
export declare class VueBuilder implements AppBuilder {
    name: string;
    versions: number[];
    foundation: "vue";
    create(name: string, version: number): Promise<void>;
    putAssets<K extends string>(name: string, _: number, template: TemplateBuilder<K>): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(): string;
    getBuildCommand(): string;
}
