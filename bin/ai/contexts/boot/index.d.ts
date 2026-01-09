import { Context, type InstructionFile } from '../base';
export declare class BootContext extends Context {
    readonly name = "boot";
    readonly description = "New App Creation - Guide users through creating a brand new Rete.js application from scratch";
    readonly instructions: InstructionFile[];
}
