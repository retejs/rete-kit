export interface InstructionFile {
    file: string;
    title: string;
}
export declare abstract class Context {
    abstract readonly name: string;
    abstract readonly description: string;
    abstract readonly instructions: InstructionFile[];
    getName(): string;
    getInstructions(): (InstructionFile & {
        path: string;
        contextId: string;
    })[];
}
