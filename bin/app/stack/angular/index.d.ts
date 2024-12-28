import { AppBuilder } from '../../app-builder';
import { TemplateBuilder } from '../../template-builder';
export type AngularVersion = 12 | 13 | 14 | 15 | 16 | 17 | 18;
export declare class AngularBuilder implements AppBuilder {
    name: string;
    versions: AngularVersion[];
    foundation: "angular";
    create(name: string, version: number): Promise<void>;
    putAssets<K extends string>(name: string, version: number, template: TemplateBuilder<K>): Promise<void>;
    putScript(name: string, path: string, code: string): Promise<void>;
    getStaticPath(name: string, version?: number): string;
    getBuildCommand(): string;
}
