import { InstructionStrategy } from '../../strategies';
import { BaseTool } from '../base';
export declare class AntigravityTool extends BaseTool {
    constructor();
    protected getStrategy(): InstructionStrategy | undefined;
}
