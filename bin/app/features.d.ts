import { AppStack } from '.';
import { AngularVersion } from './stack/angular';
import { SvelteVersion } from './stack/svelte';
import { DefaultTemplateKey } from './template-builder';
export interface Feature {
    name: string;
    mandatory?: boolean;
    templateKeys?: DefaultTemplateKey[];
    requiredDependencies?: string[];
}
export declare class Default implements Feature {
    name: string;
    mandatory: boolean;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(stack: string, next: boolean);
}
export declare class Angular implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(version: AngularVersion | null, next: boolean);
}
export declare class React implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(version: number, stack: AppStack, next: boolean);
}
export declare class Vue implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(version: 2 | 3, next: boolean);
}
export declare class Svelte implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(version: SvelteVersion, next: boolean);
}
export declare class Lit implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(version: 3, next: boolean);
}
export declare class OrderNodes implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
}
export declare class ZoomAt implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
}
export declare class Arrange implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare class Dataflow implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare class Readonly implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare class ContextMenu implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare class Minimap implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare class Reroute implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare class Selectable implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
}
export declare class Area3D implements Feature {
    name: string;
    mandatory: boolean;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(typings: boolean, next: boolean);
}
export declare class Scopes implements Feature {
    name: string;
    mandatory: boolean;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare function validateFeatures(features: Feature[], options: {
    stack: AppStack;
}): {
    issue: string;
} | {
    issue: null;
};
export declare function getDependencies(features: Feature[]): string[];
