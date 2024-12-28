import * as Features from './features';
import { AngularBuilder, LitViteBuilder, NextBuilder, NuxtBuilder, ReactBuilder, ReactViteBuilder, SvelteBuilder, ViteBuilder, VueBuilder, VueViteBuilder } from './stack';
export declare const builders: {
    angular: AngularBuilder;
    vue: VueBuilder;
    'vue-vite': VueViteBuilder;
    react: ReactBuilder;
    'react-vite': ReactViteBuilder;
    svelte: SvelteBuilder;
    vite: ViteBuilder;
    next: NextBuilder;
    nuxt: NuxtBuilder;
    'lit-vite': LitViteBuilder;
};
export type AppStack = keyof typeof builders;
export declare const appStacks: AppStack[];
export { Features };
type Options = {
    name?: string;
    stack?: AppStack;
    version?: number;
    features?: string[];
    depsAlias?: string;
    depsLabel?: string;
    next?: boolean;
    forceInstall?: boolean;
};
export declare function createApp({ name, stack, version, features, depsAlias, forceInstall, next }: Options): Promise<void>;
