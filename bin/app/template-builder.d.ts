import { AngularVersion } from './stack/angular';
import { SvelteVersion } from './stack/svelte';
export declare const templatesPath: string;
export declare const entryScriptPath: string;
export type DefaultTemplateKey = 'zoom-at' | 'react-render' | `react${number}` | 'vue-render' | `vue${2 | 3}` | 'angular-render' | `angular${AngularVersion}` | 'svelte-render' | `svelte${SvelteVersion}` | 'lit-render' | `lit${3}` | 'dataflow' | 'arrange' | 'sizes' | 'readonly' | 'order-nodes' | 'selectable' | 'context-menu' | 'import-area-extensions' | 'minimap' | 'reroute' | `stack-${string}`;
export declare class TemplateBuilder<Key extends string> {
    private keys;
    blockCommentRegex: RegExp;
    constructor(keys: Key[]);
    load(name: string): Promise<string>;
    getTemplates(): Promise<string[]>;
    private replace;
    build(template: string, format?: boolean): any;
    getEntryScript(): Promise<string>;
}
