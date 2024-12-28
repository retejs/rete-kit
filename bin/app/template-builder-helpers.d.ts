import { TemplateBuilder } from './template-builder';
export declare class FileTemplate<K extends string> {
    private readonly template;
    constructor(template: TemplateBuilder<K>);
    apply(modules: string[], format?: boolean): Promise<void>;
}
