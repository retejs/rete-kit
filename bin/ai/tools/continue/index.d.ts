import { InstructionStrategy } from '../../strategies';
import { BaseTool } from '../base';
export declare class ContinueTool extends BaseTool {
    constructor();
    protected getStrategy(): InstructionStrategy | undefined;
}
