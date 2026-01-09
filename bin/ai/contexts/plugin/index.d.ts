import { Context, type InstructionFile } from '../base';
export declare class PluginContext extends Context {
    readonly name = "plugin";
    readonly description: string;
    readonly instructions: InstructionFile[];
}
