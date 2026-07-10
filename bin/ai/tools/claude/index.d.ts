import { InstructionStrategy } from '../../strategies';
import { BaseTool } from '../base';
export declare class ClaudeTool extends BaseTool {
    constructor();
    protected getStrategy(): InstructionStrategy | undefined;
}
