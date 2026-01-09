export type TSConfig = {
    compilerOptions: {
        preserveValueImports?: boolean;
        importsNotUsedAsValues?: 'remove' | 'preserve' | 'error';
        verbatimModuleSyntax?: boolean;
        allowJs?: boolean;
        jsx?: string;
    };
};
export declare function getTSConfig<T extends TSConfig>(folder: string, name?: string): Promise<T>;
export declare function setTSConfig(folder: string, data: TSConfig, name?: string): Promise<void>;
