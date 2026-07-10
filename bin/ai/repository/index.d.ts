export interface SelectionChoice<T> {
    name: string;
    value: T;
}
export interface Identifiable {
    getName(): string;
}
export declare class Repository<T extends Identifiable> {
    private type;
    private items;
    private itemsMap;
    constructor(type: string, items: T[]);
    select(selectedName?: string, interactive?: boolean): Promise<T>;
    private validate;
    private prompt;
    private createNotFoundError;
    getNames(): string[];
}
