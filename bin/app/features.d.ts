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
export declare class History implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
}
export declare class Comments implements Feature {
    name: string;
    templateKeys: DefaultTemplateKey[];
    requiredDependencies: string[];
    constructor(next: boolean);
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
export declare function findFeature(name: string, pool: Feature[]): Feature | undefined;
export declare function resolveFeatures(names: string[], pool: Feature[]): Feature[];
export declare function featureKeys(features: Feature[]): DefaultTemplateKey[];
export declare function getDependencies(features: Feature[]): string[];
/** `string[]` — shared features. Object — one base `string[]` + optional extras `{ from, features }`. */
export type FeaturesInput = string[] | Record<string, string[] | {
    from: string;
    features: string[];
}>;
export type TemplateJob = {
    name: string;
    from: string;
    features: Feature[];
};
/** Build template jobs with resolved features. */
export declare function resolveJobs(sources: string[], optionalFeatures: Feature[], stack: AppStack, input: {
    features: FeaturesInput;
} | {
    selected: Feature[];
}): TemplateJob[];
