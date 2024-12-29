export type Package = {
    folder: string;
    name: string;
};
export declare function getReteDependenciesFor(cwd: string, folder: string): Promise<Package[]>;
export default function scan(cwd: string): Promise<{
    folder: string;
    name: string;
}[]>;
