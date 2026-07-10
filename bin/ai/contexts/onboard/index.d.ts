import { Context, type InstructionFile } from '../base';
export declare class OnboardContext extends Context {
    readonly name = "onboard";
    readonly description = "Learning & Concepts - Help users new to Rete.js understand fundamentals";
    readonly instructions: InstructionFile[];
}
